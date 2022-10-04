import dotenv from 'dotenv'
import { BuildOptions, Model, Sequelize, Transaction } from 'sequelize'
import logger from '~/src/core/logging'
import config from './config'
dotenv.config()

type DbDialect = 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | undefined

export type StaticModel = typeof Model & {
  new (values?: object, options?: BuildOptions): Model
  attrs?: { [key: string]: string }
  assoc?: { [key: string]: () => StaticModel }
  alias?: { [key: string]: string }
  scopes?: { [key: string]: string }
}

export const createDBConnection = (): Sequelize => {
  return new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect as DbDialect,
    pool: { ...config.pool },
    dialectOptions: { ...config.dialectOptions },
    timezone: config.timezone,
    logging: (sql, timing): void => {
      logger.debug(`[Elapsed: ${timing?.toString()}ms][${sql}]`)
    },
  })
}

export const database = createDBConnection()

export const newTransaction = async (): Promise<Transaction> => {
  return database.transaction({ autocommit: false })
}
