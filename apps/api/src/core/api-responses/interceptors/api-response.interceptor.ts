import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

import { RETURN_TYPE_METADATA_KEY } from '../constants';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const handler = context.getHandler();

    const returnType = this.reflector.get<Type>(RETURN_TYPE_METADATA_KEY, handler);

    return next.handle().pipe(
      map((value) => {
        const obj = plainToClass(returnType, value, { excludeExtraneousValues: true });

        return obj;
      }),
    );
  }
}
