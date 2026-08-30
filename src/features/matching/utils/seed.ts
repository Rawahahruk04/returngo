/**
 * Deterministic pseudo-randomness. The engine must return identical
 * results for identical requests, so nothing here may call `Math.random`.
 * A route (origin + destination) is hashed into a stable integer seed;
 * every value the pool/rules derive from "randomness" is actually a
 * modulo/offset walk from that one seed, so the same request always
 * regenerates the same supply and the same scores.
 */
export function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) % 999_331;
  }
  return Math.abs(hash);
}

/** Deterministically picks an item from `items` using `seed` and an `offset` to decorrelate parallel picks from the same seed. */
export function seededPick<T>(items: readonly T[], seed: number, offset = 0): T {
  return items[(seed + offset) % items.length];
}

/** Deterministically maps `seed` (with `offset`) into an integer in `[min, max]`. */
export function seededRange(seed: number, offset: number, min: number, max: number): number {
  const span = max - min + 1;
  return min + ((seed + offset * 17) % span);
}
