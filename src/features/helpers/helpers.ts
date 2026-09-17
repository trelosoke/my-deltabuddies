import { webcrypto } from 'crypto';

export function getNonce(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const array = new Uint8Array(32);
    webcrypto.getRandomValues(array);
    return Array.from(array, byte => chars[byte % chars.length]).join('');
}

export function escapeJsonCharacters(charactersJson: string): string {
    return charactersJson.replaceAll('"', '&quot;');
}