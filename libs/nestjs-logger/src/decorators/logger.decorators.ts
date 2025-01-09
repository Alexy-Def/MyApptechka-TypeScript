import { applyDecorators, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { LOGGER_PROVIDER_INJECTION_TOKEN } from '../constants';

export const SetLoggingCtx = Reflector.createDecorator<string | undefined>();

export function InjectLogger(ctx?: string): PropertyDecorator & ParameterDecorator {
  return applyDecorators(SetLoggingCtx(ctx), Inject(LOGGER_PROVIDER_INJECTION_TOKEN));
}
