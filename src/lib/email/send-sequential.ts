/** Pause between sends so Resend stays under ~2 requests/sec (one batch ≈ 10s for 10 emails). */
export const RESEND_MIN_INTERVAL_MS = 1000;

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isRateLimitError(message?: string): boolean {
  if (!message) return false;
  return /rate limit|too many requests|429/i.test(message);
}
