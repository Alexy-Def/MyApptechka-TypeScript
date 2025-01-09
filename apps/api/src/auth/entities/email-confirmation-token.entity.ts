import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { BaseEntity } from '@modules/core/entities';
import { UserEntity } from '@modules/users';

@Entity({ name: 'email_confirmation_token' })
export class EmailConfirmationTokenEntity extends BaseEntity {
  @Column()
  public token: string;

  @Column({ default: 1 })
  public timesSent: number;

  @Column({ default: true })
  public isActive: boolean;

  @Index()
  @Column()
  public userId: number;

  @ManyToOne(() => UserEntity)
  public user?: UserEntity;
}
