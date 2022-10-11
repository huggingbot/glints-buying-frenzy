/** ------------------  This is an auto-generated file. Do not edit.  ------------------  */
import { DataTypes, Model, BuildOptions, fn } from 'sequelize'
import { Optional } from '~/src/core/types'
import { database, StaticModel } from '~/src/db_scripts'
import { IRestaurantModelAttrs, restaurantModelStatic, RestaurantModelCreationAttrs } from './RestaurantModel'
const modelName = 'MenuModel'
const tableName = 'menu'
export type MenuModelCreationAttrs = Omit<
  Optional<IMenuModelAttrs, 'createdAt' | 'updatedAt'>,
  'restaurantIdRestaurantModel'
> & { restaurantIdRestaurantModel?: RestaurantModelCreationAttrs }
export interface IMenuModelAttrs {
  readonly menuId: number
  restaurantId: number
  dishName: string
  price: number
  createdAt: Date
  updatedAt: Date
  restaurantIdRestaurantModel?: IRestaurantModelAttrs
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
    restaurantId: {
      field: 'restaurantId',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'restaurant', key: 'restaurantId' },
    },
    dishName: {
      field: 'dishName',
      type: DataTypes.STRING(512),
      allowNull: false,
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
) as MenuModelStatic
type MenuModelAttrs = {
  menuId: 'menuId'
  restaurantId: 'restaurantId'
  dishName: 'dishName'
  price: 'price'
  createdAt: 'createdAt'
  updatedAt: 'updatedAt'
}
type MenuModelAssoc = { restaurantIdRestaurantModel: () => typeof restaurantModelStatic }
type MenuModelAlias = { restaurantIdRestaurantModel: 'restaurantIdRestaurantModel' }
menuModelStatic.assoc = { restaurantIdRestaurantModel: (): typeof restaurantModelStatic => restaurantModelStatic }
menuModelStatic.attrs = {
  menuId: 'menuId',
  restaurantId: 'restaurantId',
  dishName: 'dishName',
  price: 'price',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
}
menuModelStatic.alias = { restaurantIdRestaurantModel: 'restaurantIdRestaurantModel' }
export type MenuModelStatic = StaticModel & {
  new (values?: object, options?: BuildOptions): IMenuModel
  attrs: MenuModelAttrs
  assoc: MenuModelAssoc
  alias: MenuModelAlias
}
export const menuModelInit = (): void => {
  menuModelStatic.belongsTo(restaurantModelStatic, { foreignKey: 'restaurantId', as: 'restaurantIdRestaurantModel' })
}
