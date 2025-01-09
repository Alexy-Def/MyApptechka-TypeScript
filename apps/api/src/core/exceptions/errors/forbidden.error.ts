import { ERROR_TYPE } from '../constants';

import { AbstractError, ErrorOptions } from './abstract.error';

export class ForbiddenError extends AbstractError {
  constructor(message: string, options?: ErrorOptions) {
    super(ERROR_TYPE.FORBIDDEN_ERROR, message, options);
  }
}
