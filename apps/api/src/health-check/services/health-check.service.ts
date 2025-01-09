import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { InjectLogger, Logger } from '@libs/nestjs-logger';

import { HEALTH_CHECK_ERROR } from '../constants';

@Injectable()
export class HealthCheckService {
  @InjectLogger() private readonly logger: Logger;

  constructor(private readonly dataSource: DataSource) {}

  public async checkHealth(): Promise<void> {
    const errors: string[] = [];

    await this.checkDatabase().catch(() => errors.push(HEALTH_CHECK_ERROR.DATABASE_UNAVAILABLE));

    if (errors.length) {
      this.logger.error(errors);
      throw new ServiceUnavailableException(errors.map((message) => ({ message })));
    }
  }

  private async checkDatabase(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.release();
  }
}
