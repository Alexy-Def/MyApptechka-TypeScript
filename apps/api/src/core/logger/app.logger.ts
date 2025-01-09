import type { Format } from 'logform';
import { createLogger, format, Logger as WinstonLogger, transports } from 'winston';
import * as Transport from 'winston-transport';

import { Loggable, Logger } from '@libs/nestjs-logger';
import { LOGGER_TRANSPORTS } from 'config';

import { TimeLogger } from './interfaces';
import { LogLevel } from './types';

export class AppLogger implements Logger, TimeLogger {
  private readonly logger: WinstonLogger;

  constructor(ctx?: string) {
    this.logger = createLogger({
      format: format.json(),
      defaultMeta: {
        ctx: ctx || 'global',
        service: this.getServiceName(),
      },
      transports: LOGGER_TRANSPORTS.map((transportConfig) => this.getTransport(transportConfig)),
    });
  }

  /**
   * Print full info in readable format during development
   */
  private customFormat(): Format {
    return format.printf(({ level, message, timestamp, ctx, service, durationMs }) => {
      let log = `${timestamp} [${service}] ${this.getColourByLevel(
        level as LogLevel,
      )}${level}\x1b[0m [${ctx}]: ${this.getColourByLevel(level as LogLevel)}`;

      if ((message as any).msg) {
        const { msg, ...rest } = message as any;
        log += `${msg}\u001b[39m`;

        if (durationMs !== undefined) {
          log += ` +${(durationMs / 1000).toFixed(3)}s`;
        }

        if (Object.keys(rest).length) {
          for (const key in rest) {
            const str = `${key}=${rest[key]}`;
            log += `\n${str}`;
          }
        }
      } else {
        log += `\u001b[39m\n${JSON.stringify(message, null, 2)}`;
      }

      return log;
    });
  }

  private getServiceName(): string {
    if (!process.mainModule) {
      return 'test.service';
    }

    const module = process.mainModule.filename;

    if (module.endsWith('/node_modules/typeorm/cli.js')) {
      return 'typeorm-cli';
    }

    if (module.endsWith('/libs/console/src/main.ts')) {
      return 'cli';
    }

    return module
      .replace(/.*\/apps\//, '')
      .replace(/\/main.js/, '')
      .replace(/\//g, '-');
    // const match = module.match(/.*\/([a-z-]+)\/main\.js/);
    // return match ? match[1] : '';
  }

  private getColourByLevel(level: LogLevel): string {
    return {
      verbose: '\x1b[35m',
      debug: '\x1b[34m',
      info: '\x1b[32m',
      warn: '\x1b[33m',
      error: '\x1b[31m',
    }[level];
  }

  /**
   * Print all logs as string in the console during developmnet
   */
  private getPrettyLogFormat(): Format {
    return format.combine(format.timestamp(), this.customFormat());
  }

  /**
   * Print as json messages in file
   */
  private getJSONLogFormat(): Format {
    return format.combine(format.timestamp(), format.json());
  }

  log(message: Loggable): void {
    this.logger.info(this.formatMessage(message));
  }

  error(message: Loggable, trace?: string): void {
    this.logger.error(this.formatMessage(message, trace));
  }

  warn(message: Loggable): void {
    this.logger.warn(this.formatMessage(message));
  }

  debug(message: Loggable): void {
    this.logger.debug(this.formatMessage(message));
  }

  verbose(message: Loggable): void {
    this.logger.verbose(this.formatMessage(message));
  }

  timer(message: Loggable): (additional?: object) => void {
    const timer = this.logger.startTimer();

    return (additional?: object): void => {
      // default meta is not applied in winston on profilier methods, so we need to do it
      timer.done({
        message: { ...this.formatMessage(message), ...additional },
        level: 'debug',
        ...this.logger.defaultMeta,
      });
    };
  }

  private formatMessage(message: Loggable, trace?: any): object {
    return {
      ...(typeof message !== 'object' || !Object.keys(message).length ? { msg: message.toString() } : message),
      ...(trace ? { trace } : {}),
    };
  }

  private getTransport({
    LEVEL,
    FORMAT,
    TYPE,
  }: {
    LEVEL: 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';
    TYPE: 'console' | 'file';
    FORMAT: 'pretty-log' | 'json';
  }): Transport {
    switch (TYPE) {
      case 'console':
        return new transports.Console({
          level: LEVEL,
          format: this.getFormatter(FORMAT),
        });
      case 'file':
        return new transports.File({
          level: LEVEL,
          filename: `logs/${this.getServiceName()}.log`,
          maxsize: 536_870_912, // 500mb
          maxFiles: 5, // 2.5gb
          tailable: true,
          format: this.getFormatter(FORMAT),
        });
    }
  }

  private getFormatter(format: 'pretty-log' | 'json'): Format {
    switch (format) {
      case 'json':
        return this.getJSONLogFormat();
      case 'pretty-log':
        return this.getPrettyLogFormat();
      default:
        return this.getJSONLogFormat();
    }
  }
}
