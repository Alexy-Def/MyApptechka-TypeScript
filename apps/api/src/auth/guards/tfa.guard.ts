import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { ForbiddenError } from '@modules/core/exceptions';

import { TFA_ERROR } from '../constants';

@Injectable()
export class TFAGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (request?.user?.isTFARequired) {
      throw new ForbiddenError(TFA_ERROR.TFA_STEP_REQUIRED);
    }

    return true;
  }
}
