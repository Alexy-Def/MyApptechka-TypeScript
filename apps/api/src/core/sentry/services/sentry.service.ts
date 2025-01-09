import * as sentry from '@sentry/node';
import { Extras } from '@sentry/types/dist/extra';

import { ENVIRONMENT as ENV } from '@modules/core/constants';
import { SENTRY, ENVIRONMENT } from 'config';

import { ISentryService } from '../interfaces';

export class SentryService implements ISentryService {
  private installed = false;
  private serverName = '';
  private process = '';
  private environment = '';

  init(serverName: string): void {
    this.serverName = serverName;
    this.process = serverName;
    this.environment = ENVIRONMENT || ENV.LOCAL;

    if (SENTRY.ENABLED) {
      this.install();
    }
  }

  install(): void {
    sentry.init({
      dsn: SENTRY.DSN,
      serverName: this.serverName,
      environment: this.environment,
    });

    sentry.setTag('PROCESS', this.process);
    sentry.configureScope((scope) => {
      scope.addEventProcessor((event) => {
        if (this.process) {
          event.exception?.values?.forEach((v) => {
            v.type = `[${this.process}] ${v.type}`;
          });
        }

        return event;
      });
    });

    this.installed = true;
  }

  warning(message: string): void {
    this.sendMessageToSentry(message, sentry.Severity.Warning);
  }

  message(message: string): void {
    this.sendMessageToSentry(message, sentry.Severity.Info);
  }

  error(error: Error, additionalData?: Extras): Error {
    if (this.installed && this.environment !== ENV.LOCAL) {
      sentry.captureException(error, {
        extra: additionalData,
      });
    }

    return error;
  }

  private sendMessageToSentry(message: string, level: sentry.Severity): void {
    if (!this.installed || this.environment === ENV.LOCAL) {
      return;
    }

    sentry.captureMessage(message, level);
  }
}

const sentryService = new SentryService();
export { sentryService };
