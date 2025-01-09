import { Column, Entity } from 'typeorm';

import { BaseEntity } from '@modules/core/entities';

import { USER_ROLE, USER_STATUS } from '../constants';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column()
  public email: string;

  @Column({ unique: true })
  public normalizedEmail: string;

  @Column()
  public password: string;

  @Column({ type: 'enum', enum: USER_ROLE })
  public role: USER_ROLE;

  @Column({ type: 'varchar', nullable: true })
  public tfaSecret: string | null;

  @Column({ type: 'varchar', nullable: true })
  public newTfaSecret: string | null;

  @Column({ type: 'enum', enum: USER_STATUS, default: USER_STATUS.PENDING })
  public status: USER_STATUS;
}
