'use strict';

import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const key = process.env.SMTP_ENCRYPTION_KEY;
  if (!key) {
    // Fallback to a derived key from a secret (less secure but works without env var)
    const fallbackSecret =
      process.env.NEXTAUTH_SECRET || 'default-encryption-key';
    return crypto.scryptSync(fallbackSecret, 'salt', 32);
  }
  // If key is provided, ensure it's 32 bytes
  return crypto.scryptSync(key, 'salt', 32);
}

export function encryptPassword(plaintext: string): string {
  if (!plaintext) return '';

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decryptPassword(encrypted: string): string {
  if (!encrypted || !encrypted.includes(':')) return encrypted;

  try {
    const parts = encrypted.split(':');
    if (parts.length !== 3) return encrypted; // Not encrypted, return as-is

    const [ivHex, authTagHex, encryptedData] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch {
    // If decryption fails, assume it's a plain text password (migration case)
    return encrypted;
  }
}

export function isEncrypted(value: string): boolean {
  if (!value) return false;
  const parts = value.split(':');
  return parts.length === 3 && parts[0].length === 32 && parts[1].length === 32;
}
