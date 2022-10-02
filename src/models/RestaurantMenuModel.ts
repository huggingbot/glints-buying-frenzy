/** ------------------  This is an auto-generated file. Do not edit.  ------------------  */
import { DataTypes, Model, BuildOptions, fn } from 'sequelize'
import { Optional } from '~/core/types'
import { database, StaticModel } from '~/db_scripts'
import { IRestaurantModelAttrs, restaurantModelStatic, RestaurantModelCreationAttrs } from './RestaurantModel'
import { IMenuModelAttrs, menuModelStatic, MenuModelCreationAttrs } from './MenuModel'
import {
  IPurchaseHistoryModelAttrs,
  purchaseHistoryModelStatic,
  PurchaseHistoryModelCreationAttrs,
} from './PurchaseHistoryModel'
import { IUserModelAttrs, userModelStatic, UserModelCreationAttrs } from './UserModel'
const modelName = 'RestaurantMenuModel'
const tableName = 'restaurant_menu'
export type RestaurantMenuModelCreationAttrs = Omit<
  Optional<IRestaurantMenuModelAttrs, 'createdAt' | 'updatedAt'>,
  | 'restaurantIdRestaurantModel'
  | 'menuIdMenuModel'
  | 'restaurantMenuIdPurchaseHistoryModels'
  | 'restaurantMenuIdUserModels'
> & {
  restaurantIdRestaurantModel?: RestaurantModelCreationAttrs
  menuIdMenuModel?: MenuModelCreationAttrs
  restaurantMenuIdPurchaseHistoryModels?: PurchaseHistoryModelCreationAttrs[]
  restaurantMenuIdUserModels?: UserModelCreationAttrs[]
}
export interface IRestaurantMenuModelAttrs {
  readonly restaurantMenuId: number
  restaurantId: number
  menuId: number
  price: number
  createdAt: Date
  updatedAt: Date
  restaurantIdRestaurantModel?: IRestaurantModelAttrs
  menuIdMenuModel?: IMenuModelAttrs
  restaurantMenuIdPurchaseHistoryModels?: IPurchaseHistoryModelAttrs[]
  restaurantMenuIdUserModels?: IUserModelAttrs[]
}
export interface IRestaurantMenuModel extends Model, Partial<IRestaurantMenuModelAttrs> {}
export const restaurantMenuModelStatic = database.define(
  modelName,
  {
    restaurantMenuId: {
      field: 'restaurantMenuId',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    restaurantId: {
      field: 'restaurantId',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'restaurant', key: 'restaurantId' },
    },
    menuId: {
      field: 'menuId',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'menu', key: 'menuId' },
    },
    price: {
      field: 'price',
      type: DataTypes.FLOAT.UNSIGNED,
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
) as RestaurantMenuModelStatic
type RestaurantMenuModelAttrs = {
  restaurantMenuId: 'restaurantMenuId'
  restaurantId: 'restaurantId'
  menuId: 'menuId'
  price: 'price'
  createdAt: 'createdAt'
  updatedAt: 'updatedAt'
}
type RestaurantMenuModelAssoc = {
  restaurantIdRestaurantModel: () => typeof restaurantModelStatic
  menuIdMenuModel: () => typeof menuModelStatic
  restaurantMenuIdPurchaseHistoryModels: () => typeof purchaseHistoryModelStatic
  restaurantMenuIdUserModels: () => typeof userModelStatic
}
type RestaurantMenuModelAlias = {
  restaurantIdRestaurantModel: 'restaurantIdRestaurantModel'
  menuIdMenuModel: 'menuIdMenuModel'
  restaurantMenuIdPurchaseHistoryModels: 'restaurantMenuIdPurchaseHistoryModels'
  restaurantMenuIdUserModels: 'restaurantMenuIdUserModels'
}
restaurantMenuModelStatic.assoc = {
  restaurantIdRestaurantModel: (): typeof restaurantModelStatic => restaurantModelStatic,
  menuIdMenuModel: (): typeof menuModelStatic => menuModelStatic,
  restaurantMenuIdPurchaseHistoryModels: (): typeof purchaseHistoryModelStatic => purchaseHistoryModelStatic,
  restaurantMenuIdUserModels: (): typeof userModelStatic => userModelStatic,
}
restaurantMenuModelStatic.attrs = {
  restaurantMenuId: 'restaurantMenuId',
  restaurantId: 'restaurantId',
  menuId: 'menuId',
  price: 'price',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
}
restaurantMenuModelStatic.alias = {
  restaurantIdRestaurantModel: 'restaurantIdRestaurantModel',
  menuIdMenuModel: 'menuIdMenuModel',
  restaurantMenuIdPurchaseHistoryModels: 'restaurantMenuIdPurchaseHistoryModels',
  restaurantMenuIdUserModels: 'restaurantMenuIdUserModels',
}
export type RestaurantMenuModelStatic = StaticModel & {
  new (values?: object, options?: BuildOptions): IRestaurantMenuModel
  attrs: RestaurantMenuModelAttrs
  assoc: RestaurantMenuModelAssoc
  alias: RestaurantMenuModelAlias
}
export const restaurantMenuModelInit = (): void => {
  restaurantMenuModelStatic.belongsTo(restaurantModelStatic, {
    foreignKey: 'restaurantId',
    as: 'restaurantIdRestaurantModel',
  })
  restaurantMenuModelStatic.belongsTo(menuModelStatic, { foreignKey: 'menuId', as: 'menuIdMenuModel' })
  restaurantMenuModelStatic.hasMany(purchaseHistoryModelStatic, {
    foreignKey: 'restaurantMenuId',
    as: 'restaurantMenuIdPurchaseHistoryModels',
  })
  restaurantMenuModelStatic.belongsToMany(userModelStatic, {
    foreignKey: 'restaurantMenuId',
    as: 'restaurantMenuIdUserModels',
    through: purchaseHistoryModelStatic,
    otherKey: userModelStatic.primaryKeyAttribute,
  })
}
