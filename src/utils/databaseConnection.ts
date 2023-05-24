import { knex, Knex } from 'knex';

import config from '../config';
import logger from './logger';

const processEnv = config.env;

/**
 * Creates a database instance for database.
 *
 * @returns {Knex}
 */
export function getDatabaseConnection(): Knex {
  const dbConfig = {
    client: 'pg',
    connection: { ...config.database[processEnv] }
  };

  logger.info('Resolving database connection pool for database');

  return createInstance(dbConfig);
}

/**
 * Creates a knex database connection instance from
 * the provided database configuration.
 *
 * @param {Knex.Config} dbConfig
 * @returns {knex}
 */
export function createInstance(dbConfig: Knex.Config): Knex {
  return knex(dbConfig);
}
