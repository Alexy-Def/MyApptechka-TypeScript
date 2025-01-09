import bcrypt from 'bcrypt';

// eslint-disable-next-line @typescript-eslint/require-await
export async function hash(password: string, saltRounds: number): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function compare(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
