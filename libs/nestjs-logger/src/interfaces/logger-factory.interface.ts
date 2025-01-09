import { Logger } from './logger.interface';

export interface LoggerFactory {
  createLogger(ctx?: string): Logger;
}
