/**
 * Permutations — EcosystemGenome Type System
 *
 * Layer 2 of the SHA-256 hash chain.
 *   hash = sha256(designGenome.dnaHash)
 *   Each chromosome pair: [class byte] + [intensity byte]
 *   24 of 32 hash bytes consumed → ~75% entropy used
 *
 * Every chromosome must change something real in the output.
 * No decorative chromosomes.
 */
export {};
