export const ENCRYPTION_TYPES = {
  SSL: 'ssl',
  TLS: 'tls',
  NONE: 'none',
} as const;

export type EncryptionType =
  (typeof ENCRYPTION_TYPES)[keyof typeof ENCRYPTION_TYPES];

export const VALID_ENCRYPTION_TYPES: readonly EncryptionType[] = Object.values(
  ENCRYPTION_TYPES
) as EncryptionType[];

export function isValidEncryptionType(value: string): value is EncryptionType {
  return VALID_ENCRYPTION_TYPES.includes(value as EncryptionType);
}

export function getDefaultEncryptionType(): EncryptionType {
  return ENCRYPTION_TYPES.TLS;
}
