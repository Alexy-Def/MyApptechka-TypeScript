import speakeasy from 'speakeasy';

export type Encoding = 'ascii' | 'hex' | 'base32' | 'base64';

export function generateSecret(options: { length: number }): string {
  const { base32 } = speakeasy.generateSecret(options);

  return base32;
}

export function generateOtpAuthURL(options: { secret: string; label: string; encoding: Encoding }): string {
  return speakeasy.otpauthURL(options);
}

export function verify(options: { secret: string; encoding: Encoding; token: string }): boolean {
  return speakeasy.totp.verify(options);
}
