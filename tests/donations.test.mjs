import assert from 'node:assert/strict';
import { test } from 'node:test';
import { finalizeEvent, getPublicKey } from 'nostr-tools';
import { createDonationStore, parseDonation } from '../src/app/lib/donations.ts';

const providerKey = new Uint8Array(32).fill(1);
const senderKey = new Uint8Array(32).fill(2);
const recipient = getPublicKey(new Uint8Array(32).fill(3));
const policy = { recipient, receiptAuthor: getPublicKey(providerKey), since: 1767225600 };

function receipt({ sats = 1001, requestedMillisats = String(sats * 1000), content = '9 days left! LFG!', createdAt = policy.since + 10, to = recipient, signer = providerKey, requestTo = to } = {}) {
  const request = finalizeEvent({
    kind: 9734, created_at: createdAt - 1, content,
    tags: [['p', requestTo], ['relays', 'wss://nos.lol'], ...(requestedMillisats === null ? [] : [['amount', requestedMillisats]])],
  }, senderKey);
  return finalizeEvent({
    kind: 9735, created_at: createdAt, content: '',
    // Only the invoice amount is read; the trusted provider signs this test receipt.
    tags: [['p', to], ['description', JSON.stringify(request)], ['bolt11', `lnbc${sats * 10}n1${'q'.repeat(100)}`]],
  }, signer);
}

function harness({ cached = '[]', unavailable = false } = {}) {
  let raw = cached;
  let handlers;
  let writes = 0;
  let closes = 0;
  let connections = 0;
  const options = {
    policy,
    getStorage() {
      if (unavailable) throw new Error('Storage denied');
      return { getItem: () => raw, setItem: (_key, value) => { raw = value; writes++; } };
    },
    connect(value) { connections++; handlers = value; return () => { closes++; }; },
  };
  const store = createDonationStore(options);
  return { store, options, get handlers() { return handlers; }, get raw() { return raw; }, get writes() { return writes; }, get closes() { return closes; }, get connections() { return connections; } };
}

test('messages require an invoice amount strictly above 1000 sats', () => {
  for (const sats of [21, 1000]) assert.equal(parseDonation(receipt({ sats }), policy).content, '');
  const donation = parseDonation(receipt(), policy);
  assert.equal(donation.amount, 1001);
  assert.equal(donation.content, '9 days left! LFG!');
});

test('truncates messages to 256 Unicode characters without splitting emoji', () => {
  const donation = parseDonation(receipt({ content: '🌰'.repeat(300) }), policy);
  assert.equal(Array.from(donation.content).length, 256);
  assert.equal(donation.content, '🌰'.repeat(256));
});

test('rejects inflated, malformed, negative, and nonfinite request amounts', () => {
  for (const requestedMillisats of ['1001000', '-1', 'NaN', 'Infinity', '1000000oops']) {
    assert.equal(parseDonation(receipt({ sats: 1000, requestedMillisats }), policy), null);
  }
  assert.equal(parseDonation(receipt({ sats: 0 }), policy), null);
  assert.equal(parseDonation(receipt({ requestedMillisats: null }), policy).amount, 1001);
});

test('rejects wrong providers, recipients, old receipts, and tampered signatures', () => {
  for (const event of [
    receipt({ signer: senderKey }), receipt({ to: policy.receiptAuthor }),
    receipt({ requestTo: policy.receiptAuthor }), receipt({ createdAt: policy.since - 1 }),
    { ...JSON.parse(JSON.stringify(receipt())), content: 'tampered' },
    null, {}, { kind: 9735 },
  ]) assert.equal(parseDonation(event, policy), null);
});

test('hydrates signed events before relay replies and revalidates cached entries', () => {
  const valid = receipt();
  const h = harness({ cached: JSON.stringify([valid, valid, receipt({ signer: senderKey }), { amount: 999999 }]) });
  const stop = h.store.subscribe(() => {});
  assert.equal(h.store.getSnapshot().donations.length, 1);
  assert.equal(h.store.getSnapshot().donations[0].content, '9 days left! LFG!');
  assert.equal(h.store.getSnapshot().isLoading, false);
  assert.equal(h.store.getServerSnapshot().donations.length, 0);
  assert.equal(h.store.getServerSnapshot().isLoading, true);
  stop();
});

test('the first client snapshot contains cached donations before subscribing or connecting', () => {
  const h = harness({ cached: JSON.stringify([receipt()]) });
  assert.equal(h.store.getServerSnapshot().donations.length, 0);
  assert.equal(h.store.getServerSnapshot().isLoading, true);
  assert.equal(h.handlers, undefined);
  const snapshot = h.store.getSnapshot();
  assert.equal(snapshot.donations.length, 1);
  assert.equal(snapshot.donations[0].amount, 1001);
  assert.equal(snapshot.isLoading, false);
  assert.equal(h.store.getSnapshot(), snapshot);
  assert.equal(h.handlers, undefined);
  const stop = h.store.subscribe(() => {});
  assert.equal(h.store.getSnapshot(), snapshot);
  assert.ok(h.handlers);
  stop();
});

test('merges live receipts with cache, deduplicates relay replay, sorts, and persists events', () => {
  const first = receipt();
  const h = harness({ cached: JSON.stringify([first]) });
  const stop = h.store.subscribe(() => {});
  h.handlers.onevent(first);
  assert.equal(h.writes, 0);
  h.handlers.onevent(receipt({ sats: 21000 }));
  h.handlers.onevent(receipt({ sats: 21 }));
  assert.deepEqual(h.store.getSnapshot().donations.map(d => d.amount), [21000, 1001, 21]);
  assert.equal(h.store.getSnapshot().donations.reduce((sum, d) => sum + d.amount, 0), 22022);
  assert.equal(JSON.parse(h.raw).length, 3);
  assert.ok(JSON.parse(h.raw).every(e => e.kind === 9735 && e.sig));
  stop();
  const reloaded = createDonationStore(h.options);
  const stopReloaded = reloaded.subscribe(() => {});
  assert.deepEqual(reloaded.getSnapshot().donations.map(d => d.amount), [21000, 1001, 21]);
  stopReloaded();
});

test('corrupt or unavailable storage does not block live updates', () => {
  for (const options of [{ cached: '{broken' }, { cached: 'null' }, { unavailable: true }]) {
    const h = harness(options);
    const stop = h.store.subscribe(() => {});
    h.handlers.onevent(receipt());
    assert.equal(h.store.getSnapshot().donations[0].amount, 1001);
    h.handlers.oneose();
    assert.equal(h.store.getSnapshot().isLoading, false);
    stop();
  }
});

test('remounting preserves donations without duplicating them and ignores late callbacks', () => {
  const h = harness();
  const event = receipt();
  const stop = h.store.subscribe(() => {});
  h.handlers.onevent(event);
  const stale = h.handlers;
  stop();
  assert.equal(h.closes, 1);
  const stopAgain = h.store.subscribe(() => {});
  h.handlers.onevent(event);
  stale.onevent(receipt({ sats: 21000 }));
  assert.deepEqual(h.store.getSnapshot().donations.map(d => d.amount), [1001]);
  stopAgain();
});

test('all consumers share cached and live totals, counts, prizes, and one relay connection', () => {
  const h = harness({ cached: JSON.stringify([receipt()]) });
  const initial = h.store.getSnapshot();
  assert.equal(initial.donationCount, 1);
  assert.equal(initial.donationTotal, 1001);
  assert.equal(initial.total, 401001);
  assert.deepEqual(initial.prizes, { golden: 150200, hardest: 100200, nuttiest: 50200, design: 50200, fresh: 50200 });

  // The root provider holds the connection while page consumers come and go.
  const stopProvider = h.store.subscribe(() => {});
  let hero = initial;
  let history = initial;
  const stopHero = h.store.subscribe(() => { hero = h.store.getSnapshot(); });
  const stopHistory = h.store.subscribe(() => { history = h.store.getSnapshot(); });
  assert.equal(h.connections, 1);
  h.handlers.onevent(receipt({ sats: 21000 }));
  assert.equal(hero, history);
  assert.equal(hero.donationCount, 2);
  assert.equal(hero.donationTotal, 22001);
  assert.equal(hero.total, 422001);
  assert.equal(hero.prizes.golden, 154400);
  assert.deepEqual(hero.donations.map(d => d.amount), [21000, 1001]);
  stopHero();
  stopHistory();
  assert.equal(h.closes, 0);
  const stopNextPage = h.store.subscribe(() => {});
  assert.equal(h.connections, 1);
  assert.equal(h.store.getSnapshot(), hero);
  stopNextPage();
  stopProvider();
  assert.equal(h.closes, 1);
});
