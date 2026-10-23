export const DONATION_MESSAGE_THRESHOLD = 1_000;

// Add kind-9735 zap receipt event IDs here to hide their messages on /donations.
// Use the receipt's ID, not the embedded zap request's ID. Amounts still count.
export const HIDDEN_DONATION_MESSAGE_IDS = new Set<string>([]);

// Input follows textarea.maxLength (UTF-16 code units); display uses Unicode
// code points so truncation does not split surrogate pairs.
export const DONATION_MESSAGE_INPUT_LIMIT = 280;
export const DONATION_MESSAGE_DISPLAY_LIMIT = 256;

export function canIncludeDonationMessage(sats: number): boolean {
  return sats > DONATION_MESSAGE_THRESHOLD;
}

export function getDonationMessagePreview(sats: number, content: string): string {
  if (!canIncludeDonationMessage(sats)) return "";
  return Array.from(content.trim()).slice(0, DONATION_MESSAGE_DISPLAY_LIMIT).join("");
}
