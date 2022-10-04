/** ------------------  This is an auto-generated file. Do not edit.  ------------------  */
import { DataTypes, Model, BuildOptions, fn } from 'sequelize'
import { Optional } from '~/src/core/types'
import { database, StaticModel } from '~/src/db_scripts'
import {
  IPurchaseHistoryModelAttrs,
  purchaseHistoryModelStatic,
  PurchaseHistoryModelCreationAttrs,
} from './PurchaseHistoryModel'
import {
  IRestaurantMenuModelAttrs,
  restaurantMenuModelStatic,
  RestaurantMenuModelCreationAttrs,
} from './RestaurantMenuModel'
const modelName = 'UserModel'
const tableName = 'user'
export type UserModelCreationAttrs = Omit<
  Optional<IUserModelAttrs, 'createdAt' | 'updatedAt'>,
  'userIdPurchaseHistoryModels' | 'userIdRestaurantMenuModels'
> & {
  userIdPurchaseHistoryModels?: PurchaseHistoryModelCreationAttrs[]
  userIdRestaurantMenuModels?: RestaurantMenuModelCreationAttrs[]
}
export interface IUserModelAttrs {
  readonly userId: number
  name: string
  cashBalance: number
  createdAt: Date
  updatedAt: Date
  userIdPurchaseHistoryModels?: IPurchaseHistoryModelAttrs[]
  userIdRestaurantMenuModels?: IRestaurantMenuModelAttrs[]
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
  userIdRestaurantMenuModels: () => typeof restaurantMenuModelStatic
}
type UserModelAlias = {
  userIdPurchaseHistoryModels: 'userIdPurchaseHistoryModels'
  userIdRestaurantMenuModels: 'userIdRestaurantMenuModels'
}
userModelStatic.assoc = {
  userIdPurchaseHistoryModels: (): typeof purchaseHistoryModelStatic => purchaseHistoryModelStatic,
  userIdRestaurantMenuModels: (): typeof restaurantMenuModelStatic => restaurantMenuModelStatic,
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
  userIdRestaurantMenuModels: 'userIdRestaurantMenuModels',
}
export type UserModelStatic = StaticModel & {
  new (values?: object, options?: BuildOptions): IUserModel
  attrs: UserModelAttrs
  assoc: UserModelAssoc
  alias: UserModelAlias
}
export const userModelInit = (): void => {
  userModelStatic.hasMany(purchaseHistoryModelStatic, { foreignKey: 'userId', as: 'userIdPurchaseHistoryModels' })
  userModelStatic.belongsToMany(restaurantMenuModelStatic, {
    foreignKey: 'userId',
    as: 'userIdRestaurantMenuModels',
    through: purchaseHistoryModelStatic,
    otherKey: restaurantMenuModelStatic.primaryKeyAttribute,
  })
}
