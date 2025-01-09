type TypedMethodDecorator<T> = (
  target: unknown,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>,
) => TypedPropertyDescriptor<T> | void;
type TypedFunction<TArgs extends any[] = any[], TReturnType = any> = (...args: TArgs) => TReturnType;
/**
 * Makes function to have only one active execution
 */
export function OnlyOneInstance(): TypedMethodDecorator<TypedFunction> {
  return <T>(_target: unknown, _property: unknown, desc: TypedPropertyDescriptor<T>): void => {
    let running = false;
    const original: T | undefined = desc.value;

    if (typeof original !== 'function') {
      return;
    }

    type TRes = unknown;
    const wrapped = function (...args: unknown[]): void | TRes {
      if (running) {
        return;
      }

      running = true;
      const result = original.call(_target, ...args) as TRes;

      if (result instanceof Promise) {
        result.finally(() => {
          running = false;
        });
      } else {
        running = false;
      }

      return result;
    };
    desc.value = wrapped as unknown as T;
  };
}
