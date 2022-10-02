/** ------------------  This is an auto-generated file. Do not edit.  ------------------  */
import { DataTypes, Model, BuildOptions, fn } from 'sequelize'
import { Optional } from '~/core/types'
import { database, StaticModel } from '~/db_scripts'
import { IRestaurantModelAttrs, restaurantModelStatic, RestaurantModelCreationAttrs } from './RestaurantModel'
const modelName = 'RestaurantTimeModel'
const tableName = 'restaurant_time'
export type RestaurantTimeModelCreationAttrs = Omit<
  Optional<IRestaurantTimeModelAttrs, 'createdAt' | 'updatedAt'>,
  'restaurantIdRestaurantModel'
> & { restaurantIdRestaurantModel?: RestaurantModelCreationAttrs }
export interface IRestaurantTimeModelAttrs {
  readonly restaurantTimeId: number
  restaurantId: number
  dayOfWeek: number
  openingHour: number
  closingHour: number
  createdAt: Date
  updatedAt: Date
  restaurantIdRestaurantModel?: IRestaurantModelAttrs
}
export interface IRestaurantTimeModel extends Model, Partial<IRestaurantTimeModelAttrs> {}
export const restaurantTimeModelStatic = database.define(
  modelName,
  {
    restaurantTimeId: {
      field: 'restaurantTimeId',
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
) as RestaurantTimeModelStatic
type RestaurantTimeModelAttrs = {
  restaurantTimeId: 'restaurantTimeId'
  restaurantId: 'restaurantId'
  dayOfWeek: 'dayOfWeek'
  openingHour: 'openingHour'
  closingHour: 'closingHour'
  createdAt: 'createdAt'
  updatedAt: 'updatedAt'
}
type RestaurantTimeModelAssoc = { restaurantIdRestaurantModel: () => typeof restaurantModelStatic }
type RestaurantTimeModelAlias = { restaurantIdRestaurantModel: 'restaurantIdRestaurantModel' }
restaurantTimeModelStatic.assoc = {
  restaurantIdRestaurantModel: (): typeof restaurantModelStatic => restaurantModelStatic,
}
restaurantTimeModelStatic.attrs = {
  restaurantTimeId: 'restaurantTimeId',
  restaurantId: 'restaurantId',
  dayOfWeek: 'dayOfWeek',
  openingHour: 'openingHour',
  closingHour: 'closingHour',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
}
restaurantTimeModelStatic.alias = { restaurantIdRestaurantModel: 'restaurantIdRestaurantModel' }
export type RestaurantTimeModelStatic = StaticModel & {
  new (values?: object, options?: BuildOptions): IRestaurantTimeModel
  attrs: RestaurantTimeModelAttrs
  assoc: RestaurantTimeModelAssoc
  alias: RestaurantTimeModelAlias
}
export const restaurantTimeModelInit = (): void => {
  restaurantTimeModelStatic.belongsTo(restaurantModelStatic, {
    foreignKey: 'restaurantId',
    as: 'restaurantIdRestaurantModel',
  })
}
