import { DataSource } from 'typeorm';

import './apps/api/src/app.module'; // DO NOT REMOVE! Used by `getEntities()`
import { getEntities } from '@libs/typeorm-ext';
import ormconfig from 'ormconfig';

export const dataSource = new DataSource({
  ...ormconfig,
  entities: getEntities(),
  synchronize: false,
  dropSchema: false,
});
