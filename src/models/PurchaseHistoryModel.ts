/** ------------------  This is an auto-generated file. Do not edit.  ------------------  */
import { DataTypes, Model, BuildOptions, fn } from 'sequelize'
import { Optional } from '~/src/core/types'
import { database, StaticModel } from '~/src/db_scripts'
import {
  IRestaurantMenuModelAttrs,
  restaurantMenuModelStatic,
  RestaurantMenuModelCreationAttrs,
} from './RestaurantMenuModel'
import { IUserModelAttrs, userModelStatic, UserModelCreationAttrs } from './UserModel'
const modelName = 'PurchaseHistoryModel'
const tableName = 'purchase_history'
export type PurchaseHistoryModelCreationAttrs = Omit<
  Optional<IPurchaseHistoryModelAttrs, 'createdAt' | 'updatedAt'>,
  'restaurantMenuIdRestaurantMenuModel' | 'userIdUserModel'
> & { restaurantMenuIdRestaurantMenuModel?: RestaurantMenuModelCreationAttrs; userIdUserModel?: UserModelCreationAttrs }
export interface IPurchaseHistoryModelAttrs {
  readonly purchaseHistoryId: number
  restaurantMenuId: number
  userId: number
  transactionAmount: number
  transactionDate: Date
  createdAt: Date
  updatedAt: Date
  restaurantMenuIdRestaurantMenuModel?: IRestaurantMenuModelAttrs
  userIdUserModel?: IUserModelAttrs
}
export interface IPurchaseHistoryModel extends Model, Partial<IPurchaseHistoryModelAttrs> {}
export const purchaseHistoryModelStatic = database.define(
  modelName,
  {
    purchaseHistoryId: {
      field: 'purchaseHistoryId',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    restaurantMenuId: {
      field: 'restaurantMenuId',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'restaurant_menu', key: 'restaurantMenuId' },
    },
    userId: {
      field: 'userId',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'user', key: 'userId' },
    },
    transactionAmount: {
      field: 'transactionAmount',
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    transactionDate: {
      field: 'transactionDate',
      type: DataTypes.DATE,
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
) as PurchaseHistoryModelStatic
type PurchaseHistoryModelAttrs = {
  purchaseHistoryId: 'purchaseHistoryId'
  restaurantMenuId: 'restaurantMenuId'
  userId: 'userId'
  transactionAmount: 'transactionAmount'
  transactionDate: 'transactionDate'
  createdAt: 'createdAt'
  updatedAt: 'updatedAt'
}
type PurchaseHistoryModelAssoc = {
  restaurantMenuIdRestaurantMenuModel: () => typeof restaurantMenuModelStatic
  userIdUserModel: () => typeof userModelStatic
}
type PurchaseHistoryModelAlias = {
  restaurantMenuIdRestaurantMenuModel: 'restaurantMenuIdRestaurantMenuModel'
  userIdUserModel: 'userIdUserModel'
}
purchaseHistoryModelStatic.assoc = {
  restaurantMenuIdRestaurantMenuModel: (): typeof restaurantMenuModelStatic => restaurantMenuModelStatic,
  userIdUserModel: (): typeof userModelStatic => userModelStatic,
}
purchaseHistoryModelStatic.attrs = {
  purchaseHistoryId: 'purchaseHistoryId',
  restaurantMenuId: 'restaurantMenuId',
  userId: 'userId',
  transactionAmount: 'transactionAmount',
  transactionDate: 'transactionDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
}
purchaseHistoryModelStatic.alias = {
  restaurantMenuIdRestaurantMenuModel: 'restaurantMenuIdRestaurantMenuModel',
  userIdUserModel: 'userIdUserModel',
}
export type PurchaseHistoryModelStatic = StaticModel & {
  new (values?: object, options?: BuildOptions): IPurchaseHistoryModel
  attrs: PurchaseHistoryModelAttrs
  assoc: PurchaseHistoryModelAssoc
  alias: PurchaseHistoryModelAlias
}
export const purchaseHistoryModelInit = (): void => {
  purchaseHistoryModelStatic.belongsTo(restaurantMenuModelStatic, {
    foreignKey: 'restaurantMenuId',
    as: 'restaurantMenuIdRestaurantMenuModel',
  })
  purchaseHistoryModelStatic.belongsTo(userModelStatic, { foreignKey: 'userId', as: 'userIdUserModel' })
}
