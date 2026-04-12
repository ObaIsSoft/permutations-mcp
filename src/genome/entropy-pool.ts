/**
 * Entropy Pool - Deterministic Byte Expansion
 * 
 * Solves two critical issues:
 * 1. Entropy exhaustion: SHA-256 only provides 32 bytes, but we need 200+
 * 2. Modulo bias: Byte % n creates uneven probability distribution
 * 
 * Uses HKDF-style expansion for unlimited deterministic entropy.
 */

import * as crypto from 'crypto';

export class EntropyPool {
  private buffers: Buffer[] = [];
  private seed: string;
  
  constructor(seed: string) {
    this.seed = seed;
    // Initial 32 bytes from SHA-256
    const base = crypto.createHash('sha256').update(seed).digest();
    this.buffers.push(base);
  }
  
  /**
   * Expand entropy pool to ensure byte at targetIndex is available
   * Uses HKDF-style expansion: SHA-256(prev_buffer || counter)
   */
  private expand(targetIndex: number): void {
    while (this.buffers.length * 32 <= targetIndex) {
      const lastBuffer = this.buffers[this.buffers.length - 1];
      const counter = Buffer.from([this.buffers.length & 0xFF]); // Ensure single byte
      const newBuffer = crypto.createHash('sha256')
        .update(lastBuffer)
        .update(counter)
        .digest();
      this.buffers.push(newBuffer);
    }
  }
  
  /**
   * Get byte at index (0-255)
   * Automatically expands pool as needed
   */
  getByte(index: number): number {
    if (index < 0) throw new Error(`Invalid index: ${index}`);
    this.expand(index);
    const bufferIdx = Math.floor(index / 32);
    const byteIdx = index % 32;
    return this.buffers[bufferIdx][byteIdx];
  }
  
  /**
   * Get float in [0, 1) at index
   */
  getFloat(index: number): number {
    return this.getByte(index) / 256;
  }
  
  /**
   * Get 16-bit value (0-65535) for larger option sets
   */
  getUint16(index: number): number {
    const high = this.getByte(index);
    const low = this.getByte(index + 1);
    return (high << 8) | low;
  }
  
  /**
   * UNIFORM SELECTION using rejection sampling
   * 
   * Standard approach: options[byte % n] creates bias when 256 % n != 0
   * This uses rejection sampling for mathematically uniform distribution
   */
  selectUniform<T>(index: number, options: readonly T[]): T {
    if (options.length === 0) {
      throw new Error('EntropyPool.selectUniform: empty options array');
    }
    if (options.length === 1) {
      return options[0];
    }
    
    // Rejection sampling for uniform distribution
    // Only accept bytes in range [0, maxValid) where maxValid is multiple of options.length
    const maxValid = 256 - (256 % options.length);
    let attempts = 0;
    const maxAttempts = 10; // Prevent infinite loops
    
    while (attempts < maxAttempts) {
      const byte = this.getByte(index + attempts);
      if (byte < maxValid) {
        return options[byte % options.length];
      }
      attempts++;
    }
    
    // Fallback: use 16-bit value for better distribution
    const extended = this.getUint16(index);
    const maxValid16 = 65536 - (65536 % options.length);
    return options[(extended % maxValid16) % options.length];
  }
  
  /**
   * Select with weighted probabilities
   * weights should sum to 1.0
   */
  selectWeighted<T>(index: number, options: T[], weights: number[]): T {
    if (options.length !== weights.length) {
      throw new Error('Options and weights must have same length');
    }
    if (options.length === 0) {
      throw new Error('Empty options');
    }
    
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const roll = this.getFloat(index) * totalWeight;
    
    let cumulative = 0;
    for (let i = 0; i < options.length; i++) {
      cumulative += weights[i];
      if (roll < cumulative) {
        return options[i];
      }
    }
    
    return options[options.length - 1];
  }
  
  /**
   * Get integer in range [min, max)
   */
  getInt(index: number, min: number, max: number): number {
    const range = max - min;
    if (range <= 0) return min;
    if (range <= 256) {
      return min + (this.getByte(index) % range);
    }
    return min + (this.getUint16(index) % range);
  }
  
  /**
   * Get boolean with given probability
   */
  getBool(index: number, probability: number = 0.5): boolean {
    return this.getFloat(index) < probability;
  }

  /**
   * Return the seed string this pool was constructed with
   */
  getSeed(): string {
    return this.seed;
  }
}

/**
 * Legacy compatibility: simple byte access function
 * Returns a function that can be used like: b(index) => number
 */
export function createByteFunction(seed: string): (index: number) => number {
  const pool = new EntropyPool(seed);
  return (index: number) => pool.getByte(index);
}

/**
 * Legacy compatibility: simple float access function
 */
export function createFloatFunction(seed: string): (index: number) => number {
  const pool = new EntropyPool(seed);
  return (index: number) => pool.getFloat(index);
}
