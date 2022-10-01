import {
  AssociationScope,
  ModelAttributes,
  ModelOptions,
  QueryInterfaceCreateTableOptions,
  QueryInterfaceDropTableOptions,
  QueryInterfaceIndexOptions,
} from 'sequelize'

interface IAttributesIndex {
  attributes: string[]
  options?: QueryInterfaceIndexOptions
}

export enum AssocType {
  HasMany = 'hasMany',
  HasOne = 'hasOne',
  BelongsTo = 'belongsTo',
  BelongsToMany = 'belongsToMany',
}

export interface IAssociation {
  assocType: AssocType
  foreignKey: string
  sourceKey?: string
  targetKey?: string
  otherKey?: string
  assocModelName: string
  as?: string
  through?: string
  scope?: AssociationScope
}
export interface ICreatorDefinition {
  tableName: string
  modelName: string
  attributes: ModelAttributes
  indexes?: IAttributesIndex[]
  associations?: IAssociation[]
  createOptions?: QueryInterfaceCreateTableOptions
  dropOptions?: QueryInterfaceDropTableOptions
  modelOpts?: ModelOptions
  order?: number
  shouldNotCreateTable?: boolean
}
