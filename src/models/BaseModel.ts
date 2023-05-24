import { Knex } from 'knex';

import logger from '../utils/logger';

export type ConnectionResolver = () => Knex;

class BaseModel {
  public static table: string;
  public static connection?: Knex;

  /**
   * Binds a database connection to the model.
   *
   * @param {Knex} connection
   * @returns {void}
   */
  public static bindConnection(connection: Knex): void {
    logger.info('Binding database connection to the model (Lazy)');

    this.connection = connection;
  }

  /**
   * Binds a database connection to the model (chainable version of bindConnection()).
   *
   * @param {Knex} connection
   * @returns {any}
   */
  public static bind(connection: Knex): any {
    this.bindConnection(connection);

    return this;
  }

  /**
   * Resolves a database connection.
   *
   * Note: It would throw an Error on the run time if it couldn't resolve the
   * connection by the time any DB methods are invoked on it.
   * @returns {Knex}
   */
  public static getConnection(resolver?: ConnectionResolver): Knex {
    if (this.connection) {
      return this.connection;
    }

    /**
     * Note: We need to resolve db connection everytime.
     *
     * Since, all database connection info is cached in Redis.
     */
    if (resolver) {
      return resolver();
    }

    throw new Error('Cannot resolve the database connection.');
  }
}

logger.info('Initializing base model');
logger.info('Bind connection resolver for the base Model');

export default BaseModel;
