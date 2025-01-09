import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '@pixelplex/mail-service';

import { TypeOrmExtModule } from '@libs/typeorm-ext';
import { mailConfig } from '@modules/core/constants';
import { UsersModule } from '@modules/users';
import { AUTH } from 'config';

import * as Controllers from './controllers';
import * as Repositories from './repositories';
import * as Services from './services';
import * as Strategies from './strategies';

@Module({
  imports: [
    TypeOrmExtModule.forCustomRepository(Object.values(Repositories)),
    JwtModule.register({ secret: AUTH.ACCESS_JWT_SECRET, signOptions: { expiresIn: AUTH.ACCESS_TOKEN_EXPIRES_IN } }),
    UsersModule,
    MailModule.forRoot(mailConfig),
  ],
  controllers: Object.values(Controllers),
  providers: [...Object.values(Services), ...Object.values(Strategies)],
})
export class AuthModule {}
