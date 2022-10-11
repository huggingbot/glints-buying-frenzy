/** ------------------  This is an auto-generated file. Do not edit.  ------------------  */
import { DataTypes, Model, BuildOptions, fn } from 'sequelize'
import { Optional } from '~/src/core/types'
import { database, StaticModel } from '~/src/db_scripts'
import {
  IPurchaseHistoryModelAttrs,
  purchaseHistoryModelStatic,
  PurchaseHistoryModelCreationAttrs,
} from './PurchaseHistoryModel'
import { IMenuModelAttrs, menuModelStatic, MenuModelCreationAttrs } from './MenuModel'
const modelName = 'UserModel'
const tableName = 'user'
export type UserModelCreationAttrs = Omit<
  Optional<IUserModelAttrs, 'createdAt' | 'updatedAt'>,
  'userIdPurchaseHistoryModels' | 'userIdMenuModels'
> & { userIdPurchaseHistoryModels?: PurchaseHistoryModelCreationAttrs[]; userIdMenuModels?: MenuModelCreationAttrs[] }
export interface IUserModelAttrs {
  readonly userId: number
  name: string
  cashBalance: number
  createdAt: Date
  updatedAt: Date
  userIdPurchaseHistoryModels?: IPurchaseHistoryModelAttrs[]
  userIdMenuModels?: IMenuModelAttrs[]
}
export interface IUserModel extends Model, Partial<IUserModelAttrs> {}
export const userModelStatic = database.define(
  modelName,
  {
    userId: {
      field: 'userId',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      field: 'name',
      type: DataTypes.STRING,
      allowNull: false,
    },
    cashBalance: {
      field: 'cashBalance',
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    createdAt: {
      field: 'createdAt',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: fn('NOW'),
    },
    updatedAt: {
      field: 'updatedAt',
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: fn('NOW'),
    },
  },
  { tableName },
) as UserModelStatic
type UserModelAttrs = {
  userId: 'userId'
  name: 'name'
  cashBalance: 'cashBalance'
  createdAt: 'createdAt'
  updatedAt: 'updatedAt'
}
type UserModelAssoc = {
  userIdPurchaseHistoryModels: () => typeof purchaseHistoryModelStatic
  userIdMenuModels: () => typeof menuModelStatic
}
type UserModelAlias = {
  userIdPurchaseHistoryModels: 'userIdPurchaseHistoryModels'
  userIdMenuModels: 'userIdMenuModels'
}
userModelStatic.assoc = {
  userIdPurchaseHistoryModels: (): typeof purchaseHistoryModelStatic => purchaseHistoryModelStatic,
  userIdMenuModels: (): typeof menuModelStatic => menuModelStatic,
}
userModelStatic.attrs = {
  userId: 'userId',
  name: 'name',
  cashBalance: 'cashBalance',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
}
userModelStatic.alias = {
  userIdPurchaseHistoryModels: 'userIdPurchaseHistoryModels',
  userIdMenuModels: 'userIdMenuModels',
}
export type UserModelStatic = StaticModel & {
  new (values?: object, options?: BuildOptions): IUserModel
  attrs: UserModelAttrs
  assoc: UserModelAssoc
  alias: UserModelAlias
}
export const userModelInit = (): void => {
  userModelStatic.hasMany(purchaseHistoryModelStatic, { foreignKey: 'userId', as: 'userIdPurchaseHistoryModels' })
  userModelStatic.belongsToMany(menuModelStatic, {
    foreignKey: 'userId',
    as: 'userIdMenuModels',
    through: purchaseHistoryModelStatic,
    otherKey: menuModelStatic.primaryKeyAttribute,
  })
}
