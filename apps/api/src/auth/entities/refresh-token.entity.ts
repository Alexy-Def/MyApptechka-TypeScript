import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { BaseEntity } from '@modules/core/entities';
import { UserEntity } from '@modules/users';

@Entity({ name: 'refresh_token' })
export class RefreshTokenEntity extends BaseEntity {
  @Column({ default: true })
  public isActive: boolean;

  @Index()
  @Column()
  public userId: number;

  @ManyToOne(() => UserEntity)
  public user?: UserEntity;
}
