import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { Injectable, OnModuleInit } from '@nestjs/common';
import _ from 'lodash';

import { InjectLogger, Logger } from '@libs/nestjs-logger';

import { APM_KEY } from './apm.constant';
import { ApmService } from './apm.service';

type SimpleType = string | number | boolean | null | undefined;

@Injectable()
export class ApmManagerService implements OnModuleInit {
  @InjectLogger() private readonly logger: Logger;

  private readonly wrappedMethods: Set<string> = new Set();

  constructor(private readonly discovery: DiscoveryService, private readonly apmService: ApmService) {}

  async onModuleInit(): Promise<void> {
    await this.registerMethods();
  }

  async registerMethods(): Promise<void> {
    const apmService = this.apmService;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self: this = this;

    const apmSubscriptions = await this.discovery.providerMethodsWithMetaAtKey(APM_KEY);

    for (const apmSubscription of apmSubscriptions) {
      const methodName = apmSubscription.discoveredMethod.methodName;
      const instance = apmSubscription.discoveredMethod.parentClass.instance as Record<string, Function>;
      const originalFn = instance[methodName];
      const className = apmSubscription.discoveredMethod.parentClass.name;

      const tag = `${className}.${methodName}`;

      if (this.wrappedMethods.has(tag)) {
        this.logger.warn(`Method ${tag} already wrapped`);

        continue;
      }

      this.wrappedMethods.add(tag);

      apmSubscription.discoveredMethod.parentClass.instance.constructor.prototype[methodName] = function (
        ...args: unknown[]
      ): unknown {
        const preparedArgs = self.prepareArgs(args, false);
        const transactionOrSpan = apmService.startTransactionOrSpan(tag, [
          { name: 'arguments', value: JSON.stringify(preparedArgs) },
        ]);

        try {
          const result = originalFn.apply(this, args);

          if (self.isThenable(result)) {
            return result
              .catch((error) => {
                apmService.captureError(error);
                throw error;
              })
              .finally(() => {
                transactionOrSpan?.end?.();
              });
          }

          transactionOrSpan?.end?.();

          return result;
        } catch (error) {
          if (error instanceof Error) {
            apmService.captureError(error);
            throw error;
          }
        }
      };
    }
  }

  /**
   * Checks if the value is similar to the Promise
   */
  private isThenable(value: unknown): value is Promise<unknown> {
    return !!(value && typeof (value as any).then === 'function');
  }

  private prepareArgs(args: any[], withoutRecursion: false): Array<SimpleType | SimpleType[]>;
  private prepareArgs(args: any[], withoutRecursion: true): Array<SimpleType>;
  private prepareArgs(args: any[], withoutRecursion: boolean = false): Array<SimpleType | SimpleType[]> {
    return _.chain(args)
      .castArray()
      .map((arg: any): SimpleType | SimpleType[] => {
        if (_.isArray(arg)) {
          return withoutRecursion ? typeof arg : this.prepareArgs(arg, true).slice(0, 10);
        }

        const type = typeof arg;

        if (type === 'number' || type === 'string' || type === 'boolean' || _.isNil(arg)) {
          return arg;
        }

        return type;
      })
      .value();
  }
}
