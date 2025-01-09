import { ERROR_TYPE } from '../constants';

import { AbstractError, ErrorOptions } from './abstract.error';

export class ServiceError extends AbstractError {
  constructor(message: string, options?: ErrorOptions) {
    super(ERROR_TYPE.SERVICE_ERROR, message, options);
  }
}
