import type { DynamicModule, Provider } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { EntitiesMetadataStorage } from '@nestjs/typeorm/dist/entities-metadata.storage';
import { DEFAULT_DATA_SOURCE_NAME } from '@nestjs/typeorm/dist/typeorm.constants';
import type { DataSource } from 'typeorm';

import { TYPEORM_EXT_CUSTOM_REPOSITORY } from './constants';

export class TypeOrmExtModule {
  public static forCustomRepository<T extends new (...args: any[]) => any>(repositories: T[]): DynamicModule {
    const providers: Provider[] = [];
    const entities = [];

    for (const repository of repositories) {
      const entity = Reflect.getMetadata(TYPEORM_EXT_CUSTOM_REPOSITORY, repository);

      if (!entity) {
        continue;
      }

      entities.push(entity);

      providers.push({
        inject: [getDataSourceToken()],
        provide: repository,
        useFactory: (dataSource: DataSource): typeof repository => {
          const baseRepository = dataSource.getRepository(entity);

          return new repository(baseRepository.target, baseRepository.manager, baseRepository.queryRunner);
        },
      });
    }

    /*
      We use this to register entities directly, when we hang @CustomRepository decorator on repository
    */
    EntitiesMetadataStorage.addEntitiesByDataSource(DEFAULT_DATA_SOURCE_NAME, entities);

    return {
      exports: providers,
      module: TypeOrmExtModule,
      providers,
    };
  }
}
