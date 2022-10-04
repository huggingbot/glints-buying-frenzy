/** ------------------  This is an auto-generated file. Do not edit.  ------------------  */
import { DataTypes, Model, BuildOptions, fn } from 'sequelize'
import { Optional } from '~/src/core/types'
import { database, StaticModel } from '~/src/db_scripts'
import {
  IRestaurantMenuModelAttrs,
  restaurantMenuModelStatic,
  RestaurantMenuModelCreationAttrs,
} from './RestaurantMenuModel'
import { IRestaurantModelAttrs, restaurantModelStatic, RestaurantModelCreationAttrs } from './RestaurantModel'
const modelName = 'MenuModel'
const tableName = 'menu'
export type MenuModelCreationAttrs = Omit<
  Optional<IMenuModelAttrs, 'createdAt' | 'updatedAt'>,
  'menuIdRestaurantMenuModels' | 'menuIdRestaurantModels'
> & {
  menuIdRestaurantMenuModels?: RestaurantMenuModelCreationAttrs[]
  menuIdRestaurantModels?: RestaurantModelCreationAttrs[]
}
export interface IMenuModelAttrs {
  readonly menuId: number
  dishName: string
  createdAt: Date
  updatedAt: Date
  menuIdRestaurantMenuModels?: IRestaurantMenuModelAttrs[]
  menuIdRestaurantModels?: IRestaurantModelAttrs[]
}
export interface IMenuModel extends Model, Partial<IMenuModelAttrs> {}
export const menuModelStatic = database.define(
  modelName,
  {
    menuId: {
      field: 'menuId',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    dishName: {
      field: 'dishName',
      type: DataTypes.STRING(512),
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
) as MenuModelStatic
type MenuModelAttrs = { menuId: 'menuId'; dishName: 'dishName'; createdAt: 'createdAt'; updatedAt: 'updatedAt' }
type MenuModelAssoc = {
  menuIdRestaurantMenuModels: () => typeof restaurantMenuModelStatic
  menuIdRestaurantModels: () => typeof restaurantModelStatic
}
type MenuModelAlias = {
  menuIdRestaurantMenuModels: 'menuIdRestaurantMenuModels'
  menuIdRestaurantModels: 'menuIdRestaurantModels'
}
menuModelStatic.assoc = {
  menuIdRestaurantMenuModels: (): typeof restaurantMenuModelStatic => restaurantMenuModelStatic,
  menuIdRestaurantModels: (): typeof restaurantModelStatic => restaurantModelStatic,
}
menuModelStatic.attrs = { menuId: 'menuId', dishName: 'dishName', createdAt: 'createdAt', updatedAt: 'updatedAt' }
menuModelStatic.alias = {
  menuIdRestaurantMenuModels: 'menuIdRestaurantMenuModels',
  menuIdRestaurantModels: 'menuIdRestaurantModels',
}
export type MenuModelStatic = StaticModel & {
  new (values?: object, options?: BuildOptions): IMenuModel
  attrs: MenuModelAttrs
  assoc: MenuModelAssoc
  alias: MenuModelAlias
}
export const menuModelInit = (): void => {
  menuModelStatic.hasMany(restaurantMenuModelStatic, { foreignKey: 'menuId', as: 'menuIdRestaurantMenuModels' })
  menuModelStatic.belongsToMany(restaurantModelStatic, {
    foreignKey: 'menuId',
    as: 'menuIdRestaurantModels',
    through: restaurantMenuModelStatic,
    otherKey: restaurantModelStatic.primaryKeyAttribute,
  })
}
