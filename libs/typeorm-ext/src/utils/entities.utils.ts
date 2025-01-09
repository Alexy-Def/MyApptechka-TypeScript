import { EntitiesMetadataStorage } from '@nestjs/typeorm/dist/entities-metadata.storage';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DEFAULT_DATA_SOURCE_NAME } from '@nestjs/typeorm/dist/typeorm.constants';

export function getEntities(): EntityClassOrSchema[] {
  return EntitiesMetadataStorage.getEntitiesByDataSource(DEFAULT_DATA_SOURCE_NAME);
}
