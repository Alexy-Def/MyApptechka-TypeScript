import assert from 'node:assert';

import { NestFactory } from '@nestjs/core';
import { hash } from 'bcrypt';
import validator from 'validator';

import { PASSWORD_HASH_SALT_ROUNDS } from '@modules/auth/constants';
import { USER_ROLE } from '@modules/users/constants';
import { UsersService, UsersValidationService } from '@modules/users/services';
import { UsersModule } from '@modules/users/users.module';
import { AppModule } from 'apps/api/src/app.module';

async function createAdmin(email: string, password: string): Promise<void> {
  const context = await NestFactory.createApplicationContext(AppModule);
  const module = context.select<UsersModule>(UsersModule);
  const usersService = module.get<UsersService>(UsersService);
  const usersValidationService = module.get<UsersValidationService>(UsersValidationService);

  const hashedPassword = await hash(password, PASSWORD_HASH_SALT_ROUNDS);
  const normalizedEmail = usersValidationService.normalizeEmailOrFail(email);
  await usersService.createUser({ email, normalizedEmail, password: hashedPassword, role: USER_ROLE.ADMIN });
}

if (require.main === module) {
  const { EMAIL, PASSWORD } = process.env;
  assert(EMAIL, 'EMAIL is not provided');
  assert(PASSWORD, 'PASSWORD is not provided');
  assert(validator.isEmail(EMAIL), 'EMAIL is invalid');
  createAdmin(EMAIL, PASSWORD);
}
