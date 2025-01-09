import { ERROR_TYPE } from '../constants';

import { AbstractError, ErrorOptions } from './abstract.error';

export class UnauthorizedError extends AbstractError {
  constructor(message: string, options?: ErrorOptions) {
    super(ERROR_TYPE.UNAUTHORIZED_ERROR, message, options);
  }
}
