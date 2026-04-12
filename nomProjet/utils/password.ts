import * as Crypto from 'expo-crypto';

const SHA256_PATTERN = /^[a-f0-9]{64}$/i;

export function isSha256Hash(value: string): boolean {
  return SHA256_PATTERN.test(value);
}

export async function hashPassword(password: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

export async function passwordMatches(storedPassword: string, enteredPassword: string): Promise<boolean> {
  if (!storedPassword) {
    return enteredPassword === '';
  }

  if (isSha256Hash(storedPassword)) {
    return (await hashPassword(enteredPassword)) === storedPassword;
  }

  return storedPassword === enteredPassword;
}

export async function normalizePasswordForStorage(
  nextPassword: string,
  currentPassword = '',
): Promise<string> {
  if (!nextPassword) {
    return '';
  }

  if (nextPassword === currentPassword && isSha256Hash(currentPassword)) {
    return currentPassword;
  }

  return hashPassword(nextPassword);
}