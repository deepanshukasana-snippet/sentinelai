// Simulates encryption for demo purposes.
// WARNING: Do not use simple base64 in a real production password manager. Use robust AES-GCM encryption with derived keys.
export function encryptDemo(text: string): string {
  try {
    return btoa(encodeURIComponent(text));
  } catch (e) {
    return text;
  }
}

export function decryptDemo(encoded: string): string {
  try {
    return decodeURIComponent(atob(encoded));
  } catch (e) {
    return encoded;
  }
}
