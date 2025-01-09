import { HttpException } from '@nestjs/common';
import { HttpStatusCode } from 'axios';

import { ErrorDetail } from './abstract.error';

const defaultError = [
  {
    field: '',
    message: 'Too Many Requests',
  },
];

export class TooManyRequestsError extends HttpException {
  private readonly pDetails: ErrorDetail[] = [];

  constructor(details: ErrorDetail[] = defaultError) {
    super('Too Many Requests', HttpStatusCode.TooManyRequests);

    this.pDetails = details;
  }

  get details(): ErrorDetail[] {
    return this.pDetails;
  }
}
