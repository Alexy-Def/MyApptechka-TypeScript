import { DynamicModule, Module, Provider } from '@nestjs/common';

import { sentryService } from '@modules/core/sentry/index';

@Module({})
export class SentryModule {
  static forRoot({ serverName }: { serverName: string }): DynamicModule {
    sentryService.init(serverName);

    const providers: Provider[] = [
      {
        provide: 'ISentryService',
        useValue: sentryService,
      },
    ];

    return {
      module: SentryModule,
      providers,
    };
  }
}
