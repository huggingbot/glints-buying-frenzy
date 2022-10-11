/** ------------------  This is an auto-generated file. Do not edit.  ------------------  */
import { DataTypes, Model, BuildOptions, fn } from 'sequelize'
import { Optional } from '~/src/core/types'
import { database, StaticModel } from '~/src/db_scripts'
import { IMenuModelAttrs, menuModelStatic, MenuModelCreationAttrs } from './MenuModel'
import { IUserModelAttrs, userModelStatic, UserModelCreationAttrs } from './UserModel'
const modelName = 'PurchaseHistoryModel'
const tableName = 'purchase_history'
export type PurchaseHistoryModelCreationAttrs = Omit<
  Optional<IPurchaseHistoryModelAttrs, 'createdAt' | 'updatedAt'>,
  'menuIdMenuModel' | 'userIdUserModel'
> & { menuIdMenuModel?: MenuModelCreationAttrs; userIdUserModel?: UserModelCreationAttrs }
export interface IPurchaseHistoryModelAttrs {
  readonly purchaseHistoryId: number
  menuId: number
  userId: number
  transactionAmount: number
  transactionDate: Date
  createdAt: Date
  updatedAt: Date
  menuIdMenuModel?: IMenuModelAttrs
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
    menuId: {
      field: 'menuId',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'menu', key: 'menuId' },
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
  menuId: 'menuId'
  userId: 'userId'
  transactionAmount: 'transactionAmount'
  transactionDate: 'transactionDate'
  createdAt: 'createdAt'
  updatedAt: 'updatedAt'
}
type PurchaseHistoryModelAssoc = {
  menuIdMenuModel: () => typeof menuModelStatic
  userIdUserModel: () => typeof userModelStatic
}
type PurchaseHistoryModelAlias = { menuIdMenuModel: 'menuIdMenuModel'; userIdUserModel: 'userIdUserModel' }
purchaseHistoryModelStatic.assoc = {
  menuIdMenuModel: (): typeof menuModelStatic => menuModelStatic,
  userIdUserModel: (): typeof userModelStatic => userModelStatic,
}
purchaseHistoryModelStatic.attrs = {
  purchaseHistoryId: 'purchaseHistoryId',
  menuId: 'menuId',
  userId: 'userId',
  transactionAmount: 'transactionAmount',
  transactionDate: 'transactionDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
}
purchaseHistoryModelStatic.alias = { menuIdMenuModel: 'menuIdMenuModel', userIdUserModel: 'userIdUserModel' }
export type PurchaseHistoryModelStatic = StaticModel & {
  new (values?: object, options?: BuildOptions): IPurchaseHistoryModel
  attrs: PurchaseHistoryModelAttrs
  assoc: PurchaseHistoryModelAssoc
  alias: PurchaseHistoryModelAlias
}
export const purchaseHistoryModelInit = (): void => {
  purchaseHistoryModelStatic.belongsTo(menuModelStatic, { foreignKey: 'menuId', as: 'menuIdMenuModel' })
  purchaseHistoryModelStatic.belongsTo(userModelStatic, { foreignKey: 'userId', as: 'userIdUserModel' })
}
