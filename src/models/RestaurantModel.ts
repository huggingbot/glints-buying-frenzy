/** ------------------  This is an auto-generated file. Do not edit.  ------------------  */
import { DataTypes, Model, BuildOptions, fn } from 'sequelize'
import { Optional } from '~/core/types'
import { database, StaticModel } from '~/db_scripts'
import {
  IRestaurantHourModelAttrs,
  restaurantHourModelStatic,
  RestaurantHourModelCreationAttrs,
} from './RestaurantHourModel'
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
  'restaurantIdRestaurantHourModels' | 'restaurantIdRestaurantMenuModels' | 'restaurantIdMenuModels'
> & {
  restaurantIdRestaurantHourModels?: RestaurantHourModelCreationAttrs[]
  restaurantIdRestaurantMenuModels?: RestaurantMenuModelCreationAttrs[]
  restaurantIdMenuModels?: MenuModelCreationAttrs[]
}
export interface IRestaurantModelAttrs {
  readonly restaurantId: number
  restaurantName: string
  cashBalance: number
  createdAt: Date
  updatedAt: Date
  restaurantIdRestaurantHourModels?: IRestaurantHourModelAttrs[]
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
  restaurantIdRestaurantHourModels: () => typeof restaurantHourModelStatic
  restaurantIdRestaurantMenuModels: () => typeof restaurantMenuModelStatic
  restaurantIdMenuModels: () => typeof menuModelStatic
}
type RestaurantModelAlias = {
  restaurantIdRestaurantHourModels: 'restaurantIdRestaurantHourModels'
  restaurantIdRestaurantMenuModels: 'restaurantIdRestaurantMenuModels'
  restaurantIdMenuModels: 'restaurantIdMenuModels'
}
restaurantModelStatic.assoc = {
  restaurantIdRestaurantHourModels: (): typeof restaurantHourModelStatic => restaurantHourModelStatic,
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
  restaurantIdRestaurantHourModels: 'restaurantIdRestaurantHourModels',
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
  restaurantModelStatic.hasMany(restaurantHourModelStatic, {
    foreignKey: 'restaurantId',
    as: 'restaurantIdRestaurantHourModels',
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
