/** ------------------  This is an auto-generated file. Do not edit.  ------------------  */
import { DataTypes, Model, BuildOptions, fn } from 'sequelize'
import { Optional } from '~/src/core/types'
import { database, StaticModel } from '~/src/db_scripts'
import {
  IRestaurantTimeModelAttrs,
  restaurantTimeModelStatic,
  RestaurantTimeModelCreationAttrs,
} from './RestaurantTimeModel'
import { IMenuModelAttrs, menuModelStatic, MenuModelCreationAttrs } from './MenuModel'
const modelName = 'RestaurantModel'
const tableName = 'restaurant'
export type RestaurantModelCreationAttrs = Omit<
  Optional<IRestaurantModelAttrs, 'createdAt' | 'updatedAt'>,
  'restaurantIdRestaurantTimeModels' | 'restaurantIdMenuModels'
> & {
  restaurantIdRestaurantTimeModels?: RestaurantTimeModelCreationAttrs[]
  restaurantIdMenuModels?: MenuModelCreationAttrs[]
}
export interface IRestaurantModelAttrs {
  readonly restaurantId: number
  restaurantName: string
  cashBalance: number
  createdAt: Date
  updatedAt: Date
  restaurantIdRestaurantTimeModels?: IRestaurantTimeModelAttrs[]
  restaurantIdMenuModels?: IMenuModelAttrs[]
}
export interface IRestaurantModel extends Model, Partial<IRestaurantModelAttrs> {}
export const restaurantModelStatic = database.define(
  modelName,
  {
    restaurantId: {
      field: 'restaurantId',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    restaurantName: {
      field: 'restaurantName',
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
) as RestaurantModelStatic
type RestaurantModelAttrs = {
  restaurantId: 'restaurantId'
  restaurantName: 'restaurantName'
  cashBalance: 'cashBalance'
  createdAt: 'createdAt'
  updatedAt: 'updatedAt'
}
type RestaurantModelAssoc = {
  restaurantIdRestaurantTimeModels: () => typeof restaurantTimeModelStatic
  restaurantIdMenuModels: () => typeof menuModelStatic
}
type RestaurantModelAlias = {
  restaurantIdRestaurantTimeModels: 'restaurantIdRestaurantTimeModels'
  restaurantIdMenuModels: 'restaurantIdMenuModels'
}
restaurantModelStatic.assoc = {
  restaurantIdRestaurantTimeModels: (): typeof restaurantTimeModelStatic => restaurantTimeModelStatic,
  restaurantIdMenuModels: (): typeof menuModelStatic => menuModelStatic,
}
restaurantModelStatic.attrs = {
  restaurantId: 'restaurantId',
  restaurantName: 'restaurantName',
  cashBalance: 'cashBalance',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
}
restaurantModelStatic.alias = {
  restaurantIdRestaurantTimeModels: 'restaurantIdRestaurantTimeModels',
  restaurantIdMenuModels: 'restaurantIdMenuModels',
}
export type RestaurantModelStatic = StaticModel & {
  new (values?: object, options?: BuildOptions): IRestaurantModel
  attrs: RestaurantModelAttrs
  assoc: RestaurantModelAssoc
  alias: RestaurantModelAlias
}
export const restaurantModelInit = (): void => {
  restaurantModelStatic.hasMany(restaurantTimeModelStatic, {
    foreignKey: 'restaurantId',
    as: 'restaurantIdRestaurantTimeModels',
  })
  restaurantModelStatic.hasMany(menuModelStatic, { foreignKey: 'restaurantId', as: 'restaurantIdMenuModels' })
}
