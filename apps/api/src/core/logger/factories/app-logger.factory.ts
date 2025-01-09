import { Logger } from '@libs/nestjs-logger';

import { AppLogger } from '../app.logger';
import { TimeLogger } from '../interfaces';

export class AppLoggerFactory {
  static createLogger(ctx?: string): Logger {
    return new AppLogger(ctx);
  }

  static createTimeLogger(ctx?: string): TimeLogger {
    return new AppLogger(ctx);
  }
}
