import "client-only";
import { SimplePool } from "nostr-tools";

// Shared for the browser session. Construction opens no connections; consumers
// close their own subscriptions and leave the pool available to other readers.
export const nostrPool = new SimplePool();
