import { Repository } from 'typeorm';

import { CustomRepository } from '@libs/typeorm-ext';

import { EmailConfirmationTokenEntity } from '../entities';

@CustomRepository(EmailConfirmationTokenEntity)
export class EmailConfirmationTokensRepository extends Repository<EmailConfirmationTokenEntity> {}
