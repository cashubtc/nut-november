import assert from 'node:assert/strict';
import { test } from 'node:test';
import { finalizeEvent, getPublicKey } from 'nostr-tools';
import { createDonorProfileStore, parseDonorProfile } from '../src/app/lib/donorProfiles.ts';
import { harness as donationHarness, receipt, senderKey } from './helpers/donations.mjs';

const otherKey = new Uint8Array(32).fill(4);
const thirdKey = new Uint8Array(32).fill(5);
const sender = getPublicKey(senderKey);
const other = getPublicKey(otherKey);

function profile({ key = senderKey, createdAt = 100, metadata = { name: 'squirrel', display_name: 'Squirrel', picture: 'https://example.com/avatar.png' }, content = JSON.stringify(metadata), kind = 0 } = {}) {
  return finalizeEvent({ kind, created_at: createdAt, content, tags: [] }, key);
}

function harness({ cached = '[]', unavailable = false, full = false, receipts = '[]' } = {}) {
  const donations = donationHarness({ cached: receipts });
  let raw = cached;
  let writes = 0;
  const connections = [];
  const store = createDonorProfileStore({
    donations: donations.store,
    getStorage() {
      if (unavailable) throw new Error('Storage denied');
      return {
        getItem: () => raw,
        setItem: (_key, value) => {
          if (full) throw new Error('Storage full');
          raw = value;
          writes++;
        },
      };
    },
    connect(authors, handlers) {
      const connection = { authors, handlers, closes: 0 };
      connections.push(connection);
      return () => { connection.closes++; };
    },
  });
  return { store, donations, connections, get raw() { return raw; }, get writes() { return writes; } };
}

test('reads verified profiles from cache on the first snapshot without starting relay work', () => {
  const valid = profile();
  const h = harness({ cached: JSON.stringify([valid, valid, { ...valid, content: 'tampered' }, null]) });
  assert.equal(h.store.getServerSnapshot().size, 0);
  const snapshot = h.store.getSnapshot();
  assert.equal(snapshot.size, 1);
  assert.equal(snapshot.get(sender).name, 'Squirrel');
  assert.equal(h.store.getSnapshot(), snapshot);
  assert.equal(h.connections.length, 0);
  assert.equal(h.donations.connections, 0);
  assert.equal(h.writes, 0);
});

test('waits for receipt EOSE, then fetches cached and incoming donor keys in one deduplicated batch', () => {
  const h = harness({ receipts: JSON.stringify([receipt()]), cached: JSON.stringify([profile()]) });
  const stop = h.store.subscribe(() => {});
  assert.equal(h.donations.store.getSnapshot().isLoading, false);
  assert.equal(h.store.getSnapshot().get(sender).name, 'Squirrel');
  assert.equal(h.connections.length, 0);
  h.donations.handlers.onevent(receipt({ sender: otherKey }));
  h.donations.handlers.onevent(receipt({ sats: 21 }));
  h.donations.handlers.onevent(receipt({ sender: thirdKey, requestTags: [['anon']] }));
  assert.equal(h.connections.length, 0);
  h.donations.handlers.oneose();
  assert.equal(h.connections.length, 1);
  assert.deepEqual(h.connections[0].authors.sort(), [sender, other].sort());
  h.donations.handlers.oneose();
  h.donations.handlers.onevent(receipt({ sats: 42 }));
  assert.equal(h.connections.length, 1);
  stop();
});

test('starting after receipt EOSE immediately syncs the complete donor list', () => {
  const h = harness();
  const stopDonations = h.donations.store.subscribe(() => {});
  h.donations.handlers.onevent(receipt());
  h.donations.handlers.oneose();
  const stop = h.store.subscribe(() => {});
  assert.equal(h.donations.connections, 1);
  assert.deepEqual(h.connections[0].authors, [sender]);
  stop();
  stopDonations();
});

test('an empty initial receipt response never sends an unrestricted profile query', () => {
  const h = harness();
  const stop = h.store.subscribe(() => {});
  h.donations.handlers.oneose();
  assert.equal(h.connections.length, 0);
  stop();
});

test('batches new live donors without restarting earlier requests or retrying missing profiles', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const h = harness();
  const stop = h.store.subscribe(() => {});
  h.donations.handlers.onevent(receipt());
  h.donations.handlers.oneose();
  h.connections[0].handlers.onclose(); // No metadata found for this author.
  h.donations.handlers.onevent(receipt({ sender: otherKey }));
  h.donations.handlers.onevent(receipt({ sender: thirdKey }));
  h.donations.handlers.onevent(receipt({ sats: 42 }));
  t.mock.timers.tick(999);
  assert.equal(h.connections.length, 1);
  t.mock.timers.tick(1);
  assert.equal(h.connections.length, 2);
  assert.deepEqual(h.connections[1].authors.sort(), [other, getPublicKey(thirdKey)].sort());
  assert.equal(h.connections[0].closes, 0);
  h.donations.handlers.onevent(receipt({ sender: otherKey, sats: 21 }));
  t.mock.timers.tick(1000);
  assert.equal(h.connections.length, 2);
  stop();
});

test('only accepts requested authors and persists the latest signed metadata', () => {
  const old = profile();
  const newest = profile({ createdAt: 200, metadata: { name: 'New name' } });
  const h = harness({ cached: JSON.stringify([old]), receipts: JSON.stringify([receipt()]) });
  let notifications = 0;
  const stop = h.store.subscribe(() => { notifications++; });
  h.donations.handlers.oneose();
  const { onevent } = h.connections[0].handlers;
  onevent(profile({ key: otherKey }));
  onevent({ ...JSON.parse(JSON.stringify(newest)), content: 'tampered' });
  onevent(profile({ kind: 1 }));
  onevent(newest);
  onevent(old);
  onevent(newest);
  assert.equal(h.store.getSnapshot().size, 1);
  assert.equal(h.store.getSnapshot().get(sender).name, 'New name');
  assert.equal(h.store.getSnapshot().get(sender).picture, undefined);
  assert.equal(notifications, 1);
  assert.equal(h.writes, 1);
  assert.deepEqual(JSON.parse(h.raw), [JSON.parse(JSON.stringify(newest))]);
  const reloaded = harness({ cached: h.raw });
  assert.equal(reloaded.store.getSnapshot().get(sender).name, 'New name');
  stop();
});

test('equal timestamps select the lowest event id regardless of arrival order', () => {
  const events = [profile(), profile({ metadata: { name: 'Another name' } })].sort((a, b) => a.id.localeCompare(b.id));
  for (const ordered of [events, [...events].reverse()]) {
    const h = harness({ cached: JSON.stringify(ordered) });
    assert.equal(h.store.getSnapshot().get(sender).name, parseDonorProfile(events[0]).name);
  }
});

test('validates metadata shape, uses name fallbacks, and rejects unsafe avatar URLs', () => {
  for (const content of ['null', '[]', '42', '"name"', '{broken']) {
    assert.equal(parseDonorProfile(profile({ content })), null);
  }
  for (const picture of ['javascript:alert(1)', 'data:image/svg+xml,test', '/relative.png', 123]) {
    assert.deepEqual(parseDonorProfile(profile({ metadata: { display_name: ' ', name: '  squirrel  ', picture } })), { name: 'squirrel', picture: undefined });
  }
  assert.deepEqual(parseDonorProfile(profile({ metadata: { name: {}, display_name: 42 } })), { name: undefined, picture: undefined });
  assert.equal(parseDonorProfile(profile({ createdAt: -1 })), null);
  assert.equal(parseDonorProfile(null), null);
});

test('corrupt, unavailable, or full storage does not block live profiles', () => {
  for (const options of [{ cached: '{broken' }, { cached: 'null' }, { unavailable: true }, { full: true }]) {
    const h = harness(options);
    const stop = h.store.subscribe(() => {});
    h.donations.handlers.onevent(receipt());
    h.donations.handlers.oneose();
    h.connections[0].handlers.onevent(profile());
    assert.equal(h.store.getSnapshot().get(sender).name, 'Squirrel');
    stop();
  }
});

test('provider and page consumers share one sync; cleanup cancels pending work and stale callbacks', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const h = harness();
  const stopProvider = h.store.subscribe(() => {});
  const stopPage = h.store.subscribe(() => {});
  h.donations.handlers.onevent(receipt());
  h.donations.handlers.oneose();
  h.connections[0].handlers.onevent(profile());
  stopPage();
  const stopNextPage = h.store.subscribe(() => {});
  assert.equal(h.connections.length, 1);
  assert.equal(h.connections[0].closes, 0);
  assert.equal(h.donations.connections, 1);
  h.donations.handlers.onevent(receipt({ sender: otherKey }));
  stopNextPage();
  stopProvider();
  assert.equal(h.connections[0].closes, 1);
  t.mock.timers.tick(1000);
  assert.equal(h.connections.length, 1);
  const snapshot = h.store.getSnapshot();
  h.connections[0].handlers.onevent(profile({ createdAt: 300 }));
  assert.equal(h.store.getSnapshot(), snapshot);

  const stopAgain = h.store.subscribe(() => {});
  assert.equal(h.connections.length, 1);
  h.donations.handlers.oneose();
  assert.equal(h.connections.length, 2);
  h.connections[0].handlers.onevent(profile({ createdAt: 400 }));
  assert.equal(h.store.getSnapshot(), snapshot);
  stopAgain();
});

test('ignores profile callbacks after that batch has closed', () => {
  const h = harness({ receipts: JSON.stringify([receipt()]) });
  const stop = h.store.subscribe(() => {});
  h.donations.handlers.oneose();
  h.connections[0].handlers.onclose();
  h.connections[0].handlers.onevent(profile());
  assert.equal(h.store.getSnapshot().size, 0);
  stop();
});
