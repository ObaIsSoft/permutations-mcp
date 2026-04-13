/**
 * API Key & Credential Validation
 * 
 * Ensures all required external service credentials are configured before startup.
 * Prevents silent failures by validating at boot time rather than at usage time.
 */

export interface RequiredCredential {
  name: string;
  envVar: string;
  optional?: boolean;
  description: string;
  validate?: (value: string) => { valid: boolean; error?: string };
}

// ── Required credentials for production deployment ──────────────────────────

export const REQUIRED_CREDENTIALS: RequiredCredential[] = [
  {
    name: 'Anthropic API Key',
    envVar: 'ANTHROPIC_API_KEY',
    description: 'LLM service for design generation',
    // Basic validation: keys typically start with sk-
    validate: (value: string) => {
      if (!value || value.length < 20) {
        return { valid: false, error: 'Anthropic API key too short' };
      }
      if (!value.startsWith('sk-'))  {
        return { valid: false, error: 'Anthropic API key should start with sk-' };
      }
      return { valid: true };
    },
  },
];

// ── Optional credentials (warnings if missing, but don't block startup) ──────

export const OPTIONAL_CREDENTIALS: RequiredCredential[] = [
  {
    name: 'Playwright Browser Path',
    envVar: 'PLAYWRIGHT_CHROMIUM_PATH',
    optional: true,
    description: 'Custom Chromium browser for URL extraction (uses system default if not set)',
  },
  {
    name: 'PDF Processing',
    envVar: 'GENOME_SCAN_PDF_CONTENT',
    optional: true,
    description: 'Enable PDF content scanning for security (requires pdftotext)',
  },
];

/**
 * Validates all required credentials are set and valid.
 * Returns: { valid: boolean, errors: string[], warnings: string[] }
 */
export async function validateCredentialsOnStartup(): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
}> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required credentials
  for (const cred of REQUIRED_CREDENTIALS) {
    const value = process.env[cred.envVar];

    if (!value || value.trim() === '') {
      errors.push(
        `[Startup] Missing required credential: ${cred.name} (${cred.envVar})\n` +
        `  ├─ Description: ${cred.description}\n` +
        `  └─ Set the ${cred.envVar} environment variable and restart`
      );
      continue;
    }

    // Run custom validation if provided
    if (cred.validate) {
      const validation = cred.validate(value);
      if (!validation.valid) {
        errors.push(
          `[Startup] Invalid credential: ${cred.name}\n` +
          `  ├─ Error: ${validation.error}\n` +
          `  └─ Set ${cred.envVar} to a valid value and restart`
        );
      }
    }
  }

  // Check optional credentials
  for (const cred of OPTIONAL_CREDENTIALS) {
    const value = process.env[cred.envVar];

    if (!value || value.trim() === '') {
      warnings.push(
        `[Startup] Optional credential not set: ${cred.name} (${cred.envVar})\n` +
        `  ├─ Description: ${cred.description}\n` +
        `  └─ Set ${cred.envVar} to enable: ${cred.name}`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

import { logger } from "../logger.js";

/**
 * Print credential validation results with proper formatting
 */
export function printCredentialValidation(result: Awaited<ReturnType<typeof validateCredentialsOnStartup>>) {
  if (result.errors.length > 0) {
    logger.error('STARTUP VALIDATION FAILED - Missing or invalid credentials', 'Credentials');
    result.errors.forEach((err, idx) => {
      logger.error(`${idx + 1}. ${err}`, 'Credentials');
    });
  }

  if (result.warnings.length > 0) {
    logger.warn('Startup warnings - Optional features disabled', 'Credentials');
    result.warnings.forEach((warn, idx) => {
      logger.warn(`${idx + 1}. ${warn}`, 'Credentials');
    });
  }

  if (result.valid && result.warnings.length === 0) {
    logger.info('All credentials validated successfully', 'Credentials');
  }
}
