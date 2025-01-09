import { CookieOptions, Response } from 'express';

import { COOKIE } from 'config';

import { COOKIE_KEY } from '../constants';
import { TokensPair } from '../types';

export function getCookieConfig(): CookieOptions {
  return {
    maxAge: COOKIE.MAX_AGE,
    secure: COOKIE.SECURE,
    sameSite: COOKIE.SAME_SITE,
    httpOnly: COOKIE.HTTP_ONLY,
  };
}

export function setAuthCookie(response: Response, tokens: Partial<TokensPair>): void {
  if (tokens.accessToken) {
    response.cookie(COOKIE_KEY.ACCESS_TOKEN, tokens.accessToken, getCookieConfig());
  }

  if (tokens.refreshToken) {
    response.cookie(COOKIE_KEY.REFRESH_TOKEN, tokens.refreshToken, getCookieConfig());
  }
}

export function clearAuthCookie(response: Response): Response {
  response.clearCookie(COOKIE_KEY.ACCESS_TOKEN, getCookieConfig());
  response.clearCookie(COOKIE_KEY.REFRESH_TOKEN, getCookieConfig());

  return response;
}
