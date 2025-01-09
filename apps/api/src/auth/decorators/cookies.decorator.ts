import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookies = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();

  return request.cookies;
});
