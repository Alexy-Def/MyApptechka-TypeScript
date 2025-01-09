import { Injectable } from '@nestjs/common';

import { ServiceError, UnauthorizedError } from '@modules/core/exceptions';
import { USER_STATUS, USER_ROLE, UsersService, UsersValidationService } from '@modules/users';

import { AUTH_ERROR, PASSWORD_HASH_SALT_ROUNDS } from '../constants';
import { compare, hash } from '../helpers';
import { TokensPair } from '../types';

import { AuthTokensService } from './auth-tokens.service';
import { EmailConfirmationService } from './email-confirmation.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authTokensService: AuthTokensService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly usersValidationService: UsersValidationService,
    private readonly usersService: UsersService,
  ) {}

  public async signUp(email: string, password: string): Promise<TokensPair | undefined> {
    const normalizedEmail = this.usersValidationService.normalizeEmailOrFail(email);
    const existedUser = await this.usersService.findUser({ normalizedEmail });

    if (existedUser && existedUser.status !== USER_STATUS.PENDING) {
      throw new ServiceError(AUTH_ERROR.EMAIL_IS_ALREADY_USED);
    }

    if (!existedUser) {
      const hashedPassword = await hash(password, PASSWORD_HASH_SALT_ROUNDS);
      const user = {
        email,
        normalizedEmail,
        password: hashedPassword,
        role: USER_ROLE.USER,
      };
      const userId = await this.usersService.createUser(user);
      await this.emailConfirmationService.sendLink(normalizedEmail, userId);

      return this.authTokensService.createTokensPair({ id: userId, ...user });
    }

    await this.emailConfirmationService.resendLink(normalizedEmail);
  }

  public async signIn(email: string, password: string): Promise<{ accessToken: string; isTfaEnabled: boolean }> {
    const normalizedEmail = this.usersValidationService.normalizeEmailOrFail(email);
    const user = await this.usersService.findUser({ normalizedEmail });

    if (!user) {
      throw new UnauthorizedError(AUTH_ERROR.INVALID_EMAIL);
    }

    if (user.status === USER_STATUS.PENDING) {
      throw new UnauthorizedError(AUTH_ERROR.EMAIL_IS_NOT_CONFIRMED);
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedError(AUTH_ERROR.INVALID_PASSWORD);
    }

    return { accessToken: this.authTokensService.createAccessToken(user), isTfaEnabled: !!user.tfaSecret };
  }

  public async renewTokens(refreshToken: string): Promise<TokensPair> {
    return this.authTokensService.renewTokensPair(refreshToken);
  }

  public async logOut(refreshToken: string): Promise<void> {
    const { id, user } = this.authTokensService.decodeRefreshToken(refreshToken);
    await this.authTokensService.deactivateRefreshToken(id, user.id);
  }
}
