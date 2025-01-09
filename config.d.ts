declare module 'config' {
  import { ENVIRONMENT } from '@modules/core/constants';
  export const CORS: boolean;
  export const ENVIRONMENT: ENVIRONMENT;

  export const SENTRY: {
    readonly ENABLED: boolean;
    readonly DSN: string;
  };

  export const POSTGRES: {
    readonly HOST: string;
    readonly USERNAME: string;
    readonly PASSWORD: string;
    readonly PORT: number;
    readonly DB: string;
    readonly RETRY_ATTEMPTS: number;
    readonly RETRY_DELAY: number;
  };

  export const LOGGER_TRANSPORTS: {
    LEVEL: 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';
    TYPE: 'console' | 'file';
    FORMAT: 'pretty-log' | 'json';
  }[];

  export const API: {
    readonly PORT: number;
    readonly ENABLE_SWAGGER: boolean;
  };

  export const APM: {
    readonly ENABLED: boolean;
    readonly SERVICE_NAME: string;
    readonly SERVER_URL: string;
    readonly LOG_LEVEL: 'trace' | 'debug' | 'info' | 'warn' | 'warning' | 'error' | 'fatal' | 'critical' | 'off';
    readonly SECRET_TOKEN: string;
    readonly API_KEY: string;
  };

  export const AUTH: {
    readonly ACCESS_JWT_SECRET: string;
    readonly REFRESH_JWT_SECRET: string;
    readonly ACCESS_TOKEN_EXPIRES_IN: string;
    readonly REFRESH_TOKEN_EXPIRES_IN: string;
    readonly IS_TFA_ENABLED: boolean;
  };

  export const COOKIE: {
    readonly MAX_AGE: number;
    readonly SECURE: boolean;
    readonly SAME_SITE: 'lax' | 'strict' | 'none';
    readonly HTTP_ONLY: boolean;
  };

  export const MAIL: {
    GATEWAYS: ['slack' | 'sendgrid' | 'console', ...('slack' | 'sendgrid' | 'console')[]];
  };

  export const SLACK: {
    URL: string;
  };

  export const SENDGRID: {
    API_KEY: string;
    SENDER: string;
  };

  export const AWS: {
    readonly ACCESS_KEY_ID: string;
    readonly ACCESS_KEY: string;
    readonly REGION: string;
    readonly PRIVATE_BUCKET: string;
    readonly PUBLIC_BUCKET: string;
  };
}
