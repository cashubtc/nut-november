import { finalizeEvent, getPublicKey } from 'nostr-tools';
import { createDonationStore } from '../../src/app/lib/donations.ts';

export const providerKey = new Uint8Array(32).fill(1);
export const senderKey = new Uint8Array(32).fill(2);
export const recipient = getPublicKey(new Uint8Array(32).fill(3));
export const policy = { recipient, receiptAuthor: getPublicKey(providerKey), since: 1767225600 };

export function receipt({ sats = 1001, requestedMillisats = String(sats * 1000), content = '9 days left! LFG!', createdAt = policy.since + 10, to = recipient, signer = providerKey, requestTo = to, sender = senderKey, requestTags = [] } = {}) {
  const request = finalizeEvent({
    kind: 9734, created_at: createdAt - 1, content,
    tags: [['p', requestTo], ['relays', 'wss://nos.lol'], ...requestTags, ...(requestedMillisats === null ? [] : [['amount', requestedMillisats]])],
  }, sender);
  return finalizeEvent({
    kind: 9735, created_at: createdAt, content: '',
    // Only the invoice amount is read; the trusted provider signs this test receipt.
    tags: [['p', to], ['description', JSON.stringify(request)], ['bolt11', `lnbc${sats * 10}n1${'q'.repeat(100)}`]],
  }, signer);
}

export function harness({ cached = '[]', unavailable = false } = {}) {
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
