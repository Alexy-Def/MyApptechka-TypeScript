import { Injectable, NestMiddleware } from '@nestjs/common';
//@ts-ignore
import { instrumentRequest } from 'elastic-apm-node/lib/instrumentation/http-shared';
import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';

import { InjectLogger, Logger } from '@libs/nestjs-logger';

import { ApmService } from './apm.service';

@Injectable()
export class ApmMiddleware implements NestMiddleware {
  @InjectLogger() private readonly logger: Logger;

  private readonly startTransaction: (req: Request, res: Response) => void;

  constructor(private readonly apmService: ApmService) {
    const fn = instrumentRequest(apmService.getAgent(), 'http/https')(_.noop);

    this.startTransaction = (req: Request, res: Response): void => {
      try {
        fn('request', req, res);
      } catch (err) {
        if (err instanceof Error) {
          this.logger.error(`Cannot record error to apm: ${err.message}`);
        }
      }
    };
  }

  /**
   * Apply the middleware to the incoming request to start new transaction context
   */
  use(req: Request, res: Response, next: NextFunction): void {
    this.startTransaction(req, res);

    if (next) {
      next();
    }
  }
}
