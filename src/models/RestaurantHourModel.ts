/** ------------------  This is an auto-generated file. Do not edit.  ------------------  */
import { DataTypes, Model, BuildOptions, fn } from 'sequelize'
import { Optional } from '~/core/types'
import { database, StaticModel } from '~/db_scripts'
import { IRestaurantModelAttrs, restaurantModelStatic, RestaurantModelCreationAttrs } from './RestaurantModel'
const modelName = 'RestaurantHourModel'
const tableName = 'restaurant_hour'
export type RestaurantHourModelCreationAttrs = Omit<
  Optional<IRestaurantHourModelAttrs, 'createdAt' | 'updatedAt'>,
  'restaurantIdRestaurantModel'
> & { restaurantIdRestaurantModel?: RestaurantModelCreationAttrs }
export interface IRestaurantHourModelAttrs {
  readonly restaurantHourId: number
  restaurantId: number
  dayOfWeek: number
  openingHour: number
  closingHour: number
  createdAt: Date
  updatedAt: Date
  restaurantIdRestaurantModel?: IRestaurantModelAttrs
}
export interface IRestaurantHourModel extends Model, Partial<IRestaurantHourModelAttrs> {}
export const restaurantHourModelStatic = database.define(
  modelName,
  {
    restaurantHourId: {
      field: 'restaurantHourId',
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
    dayOfWeek: {
      field: 'dayOfWeek',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    openingHour: {
      field: 'openingHour',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    closingHour: {
      field: 'closingHour',
      type: DataTypes.INTEGER.UNSIGNED,
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
) as RestaurantHourModelStatic
type RestaurantHourModelAttrs = {
  restaurantHourId: 'restaurantHourId'
  restaurantId: 'restaurantId'
  dayOfWeek: 'dayOfWeek'
  openingHour: 'openingHour'
  closingHour: 'closingHour'
  createdAt: 'createdAt'
  updatedAt: 'updatedAt'
}
type RestaurantHourModelAssoc = { restaurantIdRestaurantModel: () => typeof restaurantModelStatic }
type RestaurantHourModelAlias = { restaurantIdRestaurantModel: 'restaurantIdRestaurantModel' }
restaurantHourModelStatic.assoc = {
  restaurantIdRestaurantModel: (): typeof restaurantModelStatic => restaurantModelStatic,
}
restaurantHourModelStatic.attrs = {
  restaurantHourId: 'restaurantHourId',
  restaurantId: 'restaurantId',
  dayOfWeek: 'dayOfWeek',
  openingHour: 'openingHour',
  closingHour: 'closingHour',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
}
restaurantHourModelStatic.alias = { restaurantIdRestaurantModel: 'restaurantIdRestaurantModel' }
export type RestaurantHourModelStatic = StaticModel & {
  new (values?: object, options?: BuildOptions): IRestaurantHourModel
  attrs: RestaurantHourModelAttrs
  assoc: RestaurantHourModelAssoc
  alias: RestaurantHourModelAlias
}
export const restaurantHourModelInit = (): void => {
  restaurantHourModelStatic.belongsTo(restaurantModelStatic, {
    foreignKey: 'restaurantId',
    as: 'restaurantIdRestaurantModel',
  })
}
