import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

import { POSTGRES } from 'config';

import * as Migrations from './migrations';

const migrations = Object.values(Migrations);

export = {
  type: 'postgres',
  host: POSTGRES.HOST,
  port: POSTGRES.PORT,
  username: POSTGRES.USERNAME,
  password: POSTGRES.PASSWORD,
  database: POSTGRES.DB,
  retryAttempts: POSTGRES.RETRY_ATTEMPTS,
  retryDelay: POSTGRES.RETRY_DELAY,
  migrationsRun: false,
  autoLoadEntities: true,
  synchronize: true,
  migrations: migrations,
  logger: 'advanced-console',
  cli: {
    migrationsDir: 'migrations',
  },
} as TypeOrmModuleOptions & DataSourceOptions;
