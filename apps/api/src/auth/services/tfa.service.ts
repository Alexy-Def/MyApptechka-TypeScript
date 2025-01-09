import { Injectable } from '@nestjs/common';

import { ServiceError } from '@modules/core/exceptions';
import { UserEntity, UsersService } from '@modules/users';

import { TFA_CONSTANTS, TFA_ERROR } from '../constants';
import { generateOtpAuthURL, generateSecret, verify } from '../helpers';
import { TokensPair } from '../types';

import { AuthTokensService } from './auth-tokens.service';

@Injectable()
export class TFAService {
  constructor(private readonly usersService: UsersService, private readonly authTokensService: AuthTokensService) {}

  async generateSecret(userId: number): Promise<{ otpAuthUrl: string; secret: string }> {
    const user = await this.usersService.findUserOrFail({ id: userId });
    this.assertSecretIsNotGenerated(user);
    const tfaRequisites = this.createTfaRequisites(user);
    await this.usersService.updateUser(user.id, { tfaSecret: tfaRequisites.secret });

    return tfaRequisites;
  }

  async changeSecret(userId: number, code: string): Promise<{ otpAuthUrl: string; secret: string }> {
    const user = await this.usersService.findUserOrFail({ id: userId });

    if (!user.tfaSecret) {
      throw new ServiceError(TFA_ERROR.TFA_INVALID_STATUS);
    }

    this.assertCodeCorrectness(user, code);

    const tfaRequisites = this.createTfaRequisites(user);
    await this.usersService.updateUser(user.id, { newTfaSecret: tfaRequisites.secret });

    return tfaRequisites;
  }

  async verifyCode(userId: number, code: string, useNewSecret = false): Promise<TokensPair> {
    const user = await this.usersService.findUserOrFail({ id: userId });

    if (useNewSecret ? !user.newTfaSecret : !user.tfaSecret) {
      throw new ServiceError(TFA_ERROR.TFA_INVALID_STATUS);
    }

    this.assertCodeCorrectness(user, code, useNewSecret);

    if (useNewSecret) {
      await this.usersService.updateUser(user.id, { tfaSecret: user.newTfaSecret, newTfaSecret: null });
    }

    return this.authTokensService.createTokensPair(user);
  }

  private createTfaRequisites(user: UserEntity): { otpAuthUrl: string; secret: string } {
    const secret = generateSecret({ length: TFA_CONSTANTS.SECRET_LENGTH });

    const otpAuthUrl = generateOtpAuthURL({
      secret,
      label: user.email,
      encoding: 'base32',
    });

    return { otpAuthUrl, secret };
  }

  private assertCodeCorrectness(user: UserEntity, code: string, useNewSecret: boolean = false): void {
    const isCodeCorrect = verify({
      secret: (useNewSecret ? user.newTfaSecret : user.tfaSecret) as string,
      encoding: 'base32',
      token: code,
    });

    if (!isCodeCorrect) {
      throw new ServiceError(TFA_ERROR.INCORRECT_TFA_CODE);
    }
  }

  private assertSecretIsNotGenerated(user: UserEntity): void {
    if (user.tfaSecret) {
      throw new ServiceError(TFA_ERROR.TFA_SECRET_ALREADY_EXISTS);
    }
  }
}
