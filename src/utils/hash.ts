import CryptoJS from 'crypto-js';

export function generateHash(data: string): string {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
}

export const GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000";
