import { Repository } from 'typeorm';

import { CustomRepository } from '@libs/typeorm-ext';
import { NonNullableFields } from '@libs/utils';

import { UserEntity } from '../entities';

@CustomRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
  public async createUser(
    properties: NonNullableFields<Pick<UserEntity, 'email' | 'normalizedEmail' | 'password' | 'role'>>,
  ): Promise<number> {
    const user = this.create(properties);
    const res = await this.insert(user);

    return res.identifiers.at(0)!.id;
  }
}
