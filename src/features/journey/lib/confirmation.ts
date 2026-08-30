/** Generates a human-readable reservation code, e.g. "RG-4821". Display only — there is no backend to persist it against yet. */
export function generateConfirmationCode(): string {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `RG-${digits}`;
}
