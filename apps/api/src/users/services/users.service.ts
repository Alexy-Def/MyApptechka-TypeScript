import { Injectable } from '@nestjs/common';

import { NonNullableFields } from '@libs/utils';
import { EntityNotFoundError } from '@modules/core/exceptions';

import { USER_ERROR } from '../constants';
import { UserEntity } from '../entities';
import { UsersRepository } from '../repositories';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async findUserOrFail(properties: NonNullableFields<Partial<UserEntity>>): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy(properties);

    if (!user) {
      throw new EntityNotFoundError(USER_ERROR.USER_NOT_FOUND);
    }

    return user;
  }

  public async findUser(properties: NonNullableFields<Partial<UserEntity>>): Promise<UserEntity | null> {
    return this.usersRepository.findOneBy(properties);
  }

  public async createUser(
    properties: NonNullableFields<Pick<UserEntity, 'email' | 'normalizedEmail' | 'password' | 'role'>>,
  ): Promise<number> {
    return this.usersRepository.createUser(properties);
  }

  public async updateUser(id: number, propertiesToUpdate: Partial<UserEntity>): Promise<void> {
    await this.usersRepository.update({ id }, propertiesToUpdate);
  }
}
