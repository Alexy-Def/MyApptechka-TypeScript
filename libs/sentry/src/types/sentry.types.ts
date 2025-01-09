import type { Severity } from '@sentry/types';

export type SentryOptions = {
  level?: Severity.Error;
  shallowException?: boolean;
};
