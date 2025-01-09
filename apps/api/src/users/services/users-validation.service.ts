import { Injectable } from '@nestjs/common';
import validator from 'validator';

import { ValidationError } from '@modules/core/exceptions';

import { USERS_VALIDATION_ERROR } from '../constants';

@Injectable()
export class UsersValidationService {
  public normalizeEmailOrFail(email: string): string {
    const normalizedEmail = validator.normalizeEmail(email);

    if (!normalizedEmail) {
      throw new ValidationError({ target: 'email', message: USERS_VALIDATION_ERROR.INVALID_EMAIL });
    }

    return normalizedEmail;
  }
}
