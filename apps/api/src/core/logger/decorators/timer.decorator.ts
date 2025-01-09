import { AppLoggerFactory } from '../factories';

export function ExecutionTimer(): MethodDecorator {
  return (target, property, desc): void => {
    const logger = AppLoggerFactory.createTimeLogger(`${target.constructor.name}.${property.toString()}`);
    const original = desc.value;

    if (typeof original !== 'function') {
      return;
    }

    const wrapped = async function (...args: unknown[]): Promise<unknown> {
      const timer = logger.timer('Finished');
      try {
        return await original.call(target, ...args);
      } finally {
        timer();
      }
    };
    desc.value = wrapped as any;
  };
}
