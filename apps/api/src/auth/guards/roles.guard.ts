import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { USER_ROLE } from '@modules/users/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const method = context.getHandler();
    const allowedRoles = this.reflector.get<USER_ROLE[]>('roles', method);
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      return false;
    }

    return allowedRoles.some((role) => role === request.user.role);
  }
}
