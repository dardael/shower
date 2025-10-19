/**
 * Utility functions for filename sanitization and validation
 */

/**
 * Sanitizes a filename to ensure it's safe for file system operations
 * Only allows alphanumeric characters, hyphens, underscores, and dots
 *
 * @param filename - The filename to sanitize
 * @returns The sanitized filename
 * @throws Error if filename is invalid or contains unsafe characters
 */
export function sanitizeFilename(filename: string): string {
  // Validate filename
  if (!filename || typeof filename !== 'string') {
    throw new Error('Filename must be a non-empty string');
  }

  // Check for empty filename
  if (filename.trim() === '') {
    throw new Error('Filename cannot be empty');
  }

  // Sanitize filename - only allow alphanumeric, hyphens, underscores, and dots
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '');

  // Validate that the filename still contains valid characters after sanitization
  if (!/^[a-zA-Z0-9._-]+$/.test(sanitized)) {
    throw new Error('Filename contains invalid characters');
  }

  // Ensure filename is not empty after sanitization
  if (sanitized === '') {
    throw new Error('Filename is empty after sanitization');
  }

  // Prevent directory traversal attacks
  if (
    sanitized.includes('..') ||
    sanitized.startsWith('/') ||
    sanitized.startsWith('\\')
  ) {
    throw new Error('Filename contains path traversal characters');
  }

  return sanitized;
}

/**
 * Validates if a filename is safe and follows the allowed pattern
 *
 * @param filename - The filename to validate
 * @returns True if the filename is valid, false otherwise
 */
export function isValidFilename(filename: string): boolean {
  try {
    sanitizeFilename(filename);
    return true;
  } catch {
    return false;
  }
}
