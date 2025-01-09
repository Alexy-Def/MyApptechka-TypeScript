import { AuthUserType } from './auth-user.types';

export type RefreshTokenPayloadType = { user: AuthUserType; id: number };

export type TokensPair = { accessToken: string; refreshToken: string };
