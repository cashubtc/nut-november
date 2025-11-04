"use server";
import {
  EventTemplate,
  finalizeEvent,
  generateSecretKey,
  nip04,
} from "nostr-tools";

import { SimplePool } from "nostr-tools";
import { nutnovemberPubkey } from "@/pubkey";

const pool = new SimplePool();

type FormState = {
  success: boolean;
  error?: string;
};

export async function publishForm(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  try {
    const sk = generateSecretKey();

    const formObject = Object.fromEntries(formData);
    const content = "Nutnovember: \n" + JSON.stringify(formObject);

    const encrypted = nip04.encrypt(sk, nutnovemberPubkey, content);
    const template: EventTemplate = {
      kind: 4,
      content: encrypted,
      created_at: Math.floor(Date.now() / 1000),
      tags: [["p", nutnovemberPubkey]],
    };

    const signed = finalizeEvent(template, sk);
    const pub = pool.publish(
      [
        "wss://relay.damus.io",
        "wss://relay.snort.social",
        "wss://relay.primal.net",
      ],
      signed
    );
    await Promise.all(pub);
    console.log("Event published");

    console.log(template);
    return { success: true };
  } catch (error) {
    console.error("Error publishing form:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to publish form";
    return { success: false, error: errorMessage };
  }
}
