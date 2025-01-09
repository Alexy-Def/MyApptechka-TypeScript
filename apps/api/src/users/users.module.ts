import { Module } from '@nestjs/common';

import { TypeOrmExtModule } from '@libs/typeorm-ext';

import * as Repositories from './repositories';
import * as Services from './services';

@Module({
  imports: [TypeOrmExtModule.forCustomRepository(Object.values(Repositories))],
  providers: Object.values(Services),
  exports: Object.values(Services),
})
export class UsersModule {}
