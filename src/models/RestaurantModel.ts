/** ------------------  This is an auto-generated file. Do not edit.  ------------------  */
import { DataTypes, Model, BuildOptions, fn } from 'sequelize'
import { Optional } from '~/src/core/types'
import { database, StaticModel } from '~/src/db_scripts'
import {
  IRestaurantTimeModelAttrs,
  restaurantTimeModelStatic,
  RestaurantTimeModelCreationAttrs,
} from './RestaurantTimeModel'
import {
  IRestaurantMenuModelAttrs,
  restaurantMenuModelStatic,
  RestaurantMenuModelCreationAttrs,
} from './RestaurantMenuModel'
import { IMenuModelAttrs, menuModelStatic, MenuModelCreationAttrs } from './MenuModel'
const modelName = 'RestaurantModel'
const tableName = 'restaurant'
export type RestaurantModelCreationAttrs = Omit<
  Optional<IRestaurantModelAttrs, 'createdAt' | 'updatedAt'>,
  'restaurantIdRestaurantTimeModels' | 'restaurantIdRestaurantMenuModels' | 'restaurantIdMenuModels'
> & {
  restaurantIdRestaurantTimeModels?: RestaurantTimeModelCreationAttrs[]
  restaurantIdRestaurantMenuModels?: RestaurantMenuModelCreationAttrs[]
  restaurantIdMenuModels?: MenuModelCreationAttrs[]
}
export interface IRestaurantModelAttrs {
  readonly restaurantId: number
  restaurantName: string
  cashBalance: number
  createdAt: Date
  updatedAt: Date
  restaurantIdRestaurantTimeModels?: IRestaurantTimeModelAttrs[]
  restaurantIdRestaurantMenuModels?: IRestaurantMenuModelAttrs[]
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
  restaurantIdRestaurantMenuModels: () => typeof restaurantMenuModelStatic
  restaurantIdMenuModels: () => typeof menuModelStatic
}
type RestaurantModelAlias = {
  restaurantIdRestaurantTimeModels: 'restaurantIdRestaurantTimeModels'
  restaurantIdRestaurantMenuModels: 'restaurantIdRestaurantMenuModels'
  restaurantIdMenuModels: 'restaurantIdMenuModels'
}
restaurantModelStatic.assoc = {
  restaurantIdRestaurantTimeModels: (): typeof restaurantTimeModelStatic => restaurantTimeModelStatic,
  restaurantIdRestaurantMenuModels: (): typeof restaurantMenuModelStatic => restaurantMenuModelStatic,
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
  restaurantIdRestaurantMenuModels: 'restaurantIdRestaurantMenuModels',
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
  restaurantModelStatic.hasMany(restaurantMenuModelStatic, {
    foreignKey: 'restaurantId',
    as: 'restaurantIdRestaurantMenuModels',
  })
  restaurantModelStatic.belongsToMany(menuModelStatic, {
    foreignKey: 'restaurantId',
    as: 'restaurantIdMenuModels',
    through: restaurantMenuModelStatic,
    otherKey: menuModelStatic.primaryKeyAttribute,
  })
}
