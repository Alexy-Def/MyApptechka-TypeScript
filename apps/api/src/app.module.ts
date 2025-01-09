import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApmModule } from '@libs/apm';
import { LoggerModule } from '@libs/nestjs-logger';
import { AuthModule } from '@modules/auth';
import { ExceptionsModule } from '@modules/core/exceptions';
import { AppLoggerFactory, LoggingInterceptor } from '@modules/core/logger';
import { SentryModule } from '@modules/core/sentry';
import { ValidationModule } from '@modules/core/validation';
import { GeneralModule } from '@modules/general';
import { HealthCheckModule } from '@modules/health-check';
import { UsersModule } from '@modules/users';
import { APM } from 'config';
import ormconfig from 'ormconfig';

@Module({
  imports: [
    LoggerModule.forRoot(AppLoggerFactory),
    SentryModule.forRoot({ serverName: 'API' }),
    ExceptionsModule.forRoot(),
    ValidationModule.forRoot(),
    TypeOrmModule.forRoot(ormconfig),
    GeneralModule,
    ApmModule.forRoot({
      active: APM.ENABLED,
      serviceName: APM.SERVICE_NAME,
      serverUrl: APM.SERVER_URL,
      secretToken: APM.SECRET_TOKEN,
      apiKey: APM.API_KEY,
      logLevel: APM.LOG_LEVEL,
    }),
    UsersModule,
    HealthCheckModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
