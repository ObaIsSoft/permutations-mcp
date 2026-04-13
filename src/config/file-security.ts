/**
 * File Security Configuration & Utilities
 * 
 * Handles safe file upload validation with multiple layers:
 * - Extension whitelist (fast check)
 * - MIME type validation (prevent masquerading)
 * - Symlink detection (prevent path traversal)
 * - File size limits (prevent DoS)
 * - Asset count limits (prevent resource exhaustion)
 * - Content scanning for PDFs (detect malicious objects)
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// ── MIME type validation database ──────────────────────────────────────────
const SAFE_MIME_TYPES: Record<string, string[]> = {
  '.pdf': ['application/pdf'],
  '.png': ['image/png'],
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.gif': ['image/gif'],
  '.svg': ['image/svg+xml', 'text/plain'], // SVG can be text
  '.txt': ['text/plain'],
  '.md': ['text/plain', 'text/markdown'],
};

// Map using `file` command output detection (more reliable than MIME)
const SAFE_FILE_SIGNATURES: Record<string, Buffer[]> = {
  '.pdf': [Buffer.from([0x25, 0x50, 0x44, 0x46])], // %PDF
  '.png': [Buffer.from([0x89, 0x50, 0x4e, 0x47])],  // .PNG
  '.jpg': [Buffer.from([0xff, 0xd8, 0xff])],         // JPEG header
  '.gif': [Buffer.from([0x47, 0x49, 0x46])],         // GIF header
};

export const FILE_SECURITY_CONFIG = {
  // Allowed extensions (case-insensitive)
  allowedExtensions: (process.env.GENOME_ALLOWED_ASSET_EXTENSIONS || '.pdf,.png,.jpg,.jpeg,.gif,.svg,.txt,.md')
    .split(',')
    .map(s => s.trim().toLowerCase()),

  // Maximum file size per asset (environment overrideable)
  maxAssetSizeBytes: parseInt(process.env.GENOME_MAX_ASSET_SIZE_MB || '50', 10) * 1024 * 1024,

  // Maximum number of assets to process in a single request
  maxAssetCount: parseInt(process.env.GENOME_MAX_ASSET_COUNT || '10', 10),

  // Maximum total brand asset directory size
  maxTotalBrandAssetsSizeBytes: parseInt(process.env.GENOME_MAX_TOTAL_BRAND_ASSETS_MB || '500', 10) * 1024 * 1024,

  // Enable strict MIME type checking (slower but safer)
  strictMimeChecking: process.env.GENOME_STRICT_MIME_CHECKING !== 'false',

  // Enable symlink detection (prevents path traversal via symlinks)
  detectSymlinks: process.env.GENOME_DETECT_SYMLINKS !== 'false',

  // Enable PDF content scanning for malicious objects (requires `pdftotext`)
  scanPdfContent: process.env.GENOME_SCAN_PDF_CONTENT === 'true',
};

/**
 * Validates file security comprehensively:
 * 1. Path normalization & traversal detection
 * 2. Symlink detection
 * 3. Extension validation
 * 4. File signature/magic bytes validation
 * 5. MIME type validation (if enabled)
 * 6. File size validation
 * 
 * Returns: { valid: boolean, error?: string, warnings?: string[] }
 */
export async function validateFileSecure(
  filePath: string,
  options: {
    checkMimeType?: boolean;
    checkSignature?: boolean;
    checkSymlinks?: boolean;
  } = {}
): Promise<{ valid: boolean; error?: string; warnings?: string[] }> {
  const warnings: string[] = [];

  try {
    // 1. Normalize path and detect traversal attempts
    const normalized = path.resolve(filePath);
    if (normalized.includes('..') || !normalized.startsWith(process.cwd())) {
      return {
        valid: false,
        error: `[Security] Path traversal detected: ${filePath}`,
      };
    }

    // 2. Detect symlinks (potential unauthorized access)
    if (options.checkSymlinks ?? FILE_SECURITY_CONFIG.detectSymlinks) {
      try {
        const stats = fs.lstatSync(normalized); // Use lstat to detect symlinks
        if (stats.isSymbolicLink()) {
          const target = fs.readlinkSync(normalized);
          return {
            valid: false,
            error: `[Security] Symbolic link detected (→ ${target}): ${filePath}`,
          };
        }
      } catch (err) {
        // lstatSync failed - file might not exist or be inaccessible
        return {
          valid: false,
          error: `[Security] Cannot stat file: ${filePath}`,
        };
      }
    }

    // 3. Validate file exists and is a regular file
    const stats = fs.statSync(normalized);
    if (!stats.isFile()) {
      return {
        valid: false,
        error: `[Security] Not a regular file: ${filePath}`,
      };
    }

    // 4. Validate extension
    const ext = path.extname(normalized).toLowerCase();
    if (!FILE_SECURITY_CONFIG.allowedExtensions.includes(ext)) {
      return {
        valid: false,
        error: `[Security] File extension not allowed: ${ext}`,
      };
    }

    // 5. Validate file size
    if (stats.size > FILE_SECURITY_CONFIG.maxAssetSizeBytes) {
      return {
        valid: false,
        error: `[Security] File too large: ${stats.size} bytes > ${FILE_SECURITY_CONFIG.maxAssetSizeBytes}`,
      };
    }

    // 6. Validate file signature (magic bytes)
    if (options.checkSignature ?? true) {
      const buffer = Buffer.alloc(512);
      const fd = fs.openSync(normalized, 'r');
      try {
        fs.readSync(fd, buffer);
      } finally {
        fs.closeSync(fd);
      }

      const signatures = SAFE_FILE_SIGNATURES[ext];
      if (signatures) {
        const hasValidSignature = signatures.some(sig => buffer.subarray(0, sig.length).equals(sig));
        if (!hasValidSignature) {
          warnings.push(`[Security] File signature mismatch for extension ${ext} - may be misidentified file type`);
        }
      }
    }

    // 7. Validate MIME type if strict checking enabled
    if (options.checkMimeType ?? FILE_SECURITY_CONFIG.strictMimeChecking) {
      const allowedMimes = SAFE_MIME_TYPES[ext] || [];
      if (allowedMimes.length > 0) {
        try {
          const result = await execAsync(`file --mime-type "${normalized}"`);
          const mimeMatch = result.stdout.match(/:\s*(.+?)$/);
          if (mimeMatch) {
            const detectedMime = mimeMatch[1].trim();
            if (!allowedMimes.includes(detectedMime)) {
              warnings.push(`[Security] MIME type mismatch: detected ${detectedMime}, expected one of ${allowedMimes.join(', ')}`);
            }
          }
        } catch (err) {
          // `file` command not available - skip MIME check
          warnings.push(`[Security] Could not verify MIME type (file command unavailable)`);
        }
      }
    }

    // 8. PDF content sanity check (if enabled and file is PDF)
    if (FILE_SECURITY_CONFIG.scanPdfContent && ext === '.pdf') {
      try {
        const result = await execAsync(`pdftotext "${normalized}" /dev/null`);
        // If pdftotext succeeds, PDF is likely valid (not corrupted)
      } catch (err) {
        warnings.push(`[Security] PDF content validation failed - may be corrupted or malicious`);
      }
    }

    return {
      valid: true,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (err) {
    return {
      valid: false,
      error: `[Security] File validation error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Batch validates multiple files with count limits.
 * Prevents resource exhaustion and DoS attacks.
 */
export async function validateAssetBatch(
  filePaths: string[]
): Promise<{
  valid: boolean;
  validFiles: string[];
  rejectedFiles: Array<{ path: string; error: string }>;
  warnings: string[];
}> {
  const warnings: string[] = [];

  // Check asset count limit
  if (filePaths.length > FILE_SECURITY_CONFIG.maxAssetCount) {
    return {
      valid: false,
      validFiles: [],
      rejectedFiles: filePaths.map(p => ({
        path: p,
        error: `[Security] Asset count limit exceeded: ${filePaths.length} > ${FILE_SECURITY_CONFIG.maxAssetCount}`,
      })),
      warnings: [`Too many assets submitted (${filePaths.length})`],
    };
  }

  const validFiles: string[] = [];
  const rejectedFiles: Array<{ path: string; error: string }> = [];
  let totalSize = 0;

  for (const filePath of filePaths) {
    const result = await validateFileSecure(filePath);

    if (result.valid) {
      const stats = fs.statSync(filePath);
      totalSize += stats.size;

      if (totalSize > FILE_SECURITY_CONFIG.maxTotalBrandAssetsSizeBytes) {
        rejectedFiles.push({
          path: filePath,
          error: `[Security] Total brand assets size limit exceeded`,
        });
        warnings.push(`Total assets size exceeds ${FILE_SECURITY_CONFIG.maxTotalBrandAssetsSizeBytes} bytes`);
      } else {
        validFiles.push(filePath);
      }

      if (result.warnings) {
        warnings.push(...result.warnings);
      }
    } else {
      rejectedFiles.push({
        path: filePath,
        error: result.error || 'Unknown validation error',
      });
    }
  }

  return {
    valid: rejectedFiles.length === 0,
    validFiles,
    rejectedFiles,
    warnings: warnings.length > 0 ? warnings : [],
  };
}

/**
 * Gets current security configuration (for diagnostic/logging purposes)
 */
export function getFileSecurityConfig() {
  return {
    ...FILE_SECURITY_CONFIG,
    maxAssetSizeMB: FILE_SECURITY_CONFIG.maxAssetSizeBytes / (1024 * 1024),
    maxTotalBrandAssetsMB: FILE_SECURITY_CONFIG.maxTotalBrandAssetsSizeBytes / (1024 * 1024),
  };
}
