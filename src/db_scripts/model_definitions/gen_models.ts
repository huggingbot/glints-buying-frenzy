import fs from 'fs'
import _ from 'lodash'
import { join } from 'path'
import rimraf from 'rimraf'
import { AbstractDataType, DataType, ModelAttributeColumnOptions } from 'sequelize'
import { AssocType, IAssociation, ICreatorDefinition } from './types'
import { format, printDebug, readDefinitions } from './util'

const DEFINITION_PATH = join(__dirname, 'definitions')
const OUTPATH = join(__dirname, '..', '..', 'models')
const COMMON_TYPE_PATH = '~/core/types'
const DB_IMPORT_PATH = '~/db_scripts'

const main = async (): Promise<void> => {
  const definitions = await readDefinitions<ICreatorDefinition>(DEFINITION_PATH)
  rimraf.sync(OUTPATH)
  fs.mkdirSync(OUTPATH)

  const indexImports: string[] = []
  const indexExports: string[] = []

  indexExports.push('export const modelsInit = (): void => {')

  for (const def of definitions) {
    printDebug(`[gen-models] ${def.modelName}`)
    def.modelName = def.modelName.endsWith('Model') ? def.modelName : `${def.modelName}Model`
    const camelModelName = def.modelName[0].toLowerCase().concat(def.modelName.substring(1))
    if (def.associations !== undefined && def.associations.length > 0) {
      indexImports.push(`import { ${camelModelName}Init } from './${def.modelName}';`)
      indexExports.push(`${camelModelName}Init();`)
    }
    const model = genDef(def)
    fs.writeFileSync(join(OUTPATH, `${def.modelName}.ts`), model)
  }

  indexExports.push('}')
  const indexOutput: string[] = [...indexImports, ...(indexExports.length === 2 ? [] : indexExports)]
  fs.writeFileSync(join(OUTPATH, 'index.ts'), format(indexOutput.join('')))
}

const genDef = (def: ICreatorDefinition): string => {
  const imports: string[] = []
  const constName: string[] = []
  const modelAttrIntf: string[] = []
  const createModelAttrType: string[] = []
  const modelIntf: string[] = []
  const modelDef: string[] = []
  const modelStatic: string[] = []
  const modelName = def.modelName
  const staticModelName = `${modelName}Static`
  const staticModelInstanceName = staticModelName[0].toLowerCase().concat(staticModelName.substring(1))

  imports.push("import { DataTypes, Model, BuildOptions, fn } from 'sequelize';")
  imports.push(`import { Optional } from '${COMMON_TYPE_PATH}';`)
  imports.push(`import { database, StaticModel } from '${DB_IMPORT_PATH}';`)

  modelIntf.push(`export interface I${modelName} extends Model, Partial<I${modelName}Attrs> {`)
  constName.push(`const modelName = '${modelName}';`)
  constName.push(`const tableName = '${def.tableName}';`)

  modelAttrIntf.push(`export interface I${modelName}Attrs {`)

  modelDef.push(`export const ${staticModelInstanceName} = database.define(`)
  modelDef.push('modelName,{')
  modelStatic.push(`export type ${staticModelName} = StaticModel & {`)
  modelStatic.push(`new (values?: object, options?: BuildOptions): I${modelName};`)
  modelStatic.push(`attrs: ${modelName}Attrs;`)

  const [attrs, attrsType, modelIntfAttrs, modelDefAttrs, optionalCreationAttrs] = processAttrs(
    def,
    modelName,
    staticModelInstanceName,
    imports,
  )

  modelDef.push(...modelDefAttrs)
  modelDef.push('},')

  if (def.modelOpts !== undefined) {
    def.modelOpts.tableName = def.tableName
  }
  const modelOptions = def.modelOpts === undefined ? '{tableName}' : JSON.stringify(def.modelOpts)
  modelDef.push(modelOptions)

  modelDef.push(`) as ${staticModelName};`)

  const modelInit: string[] = []
  modelInit.push(`export const ${_.camelCase(modelName)}Init = (): void => {`)
  const [
    assocImports,
    modelIntfAssocs,
    assocInit,
    assoc,
    alias,
    assocType,
    aliasType,
    modelIntfAssocsCreation,
    modelIntfAssocsAlias,
  ] = buildAssociations(modelName, staticModelInstanceName, def.associations)
  modelInit.push(...assocInit)
  modelInit.push('}')
  const isNotEmptyInit = assocInit.length > 0

  if (modelIntfAssocsAlias.length > 0) {
    createModelAttrType.push(
      `export type ${modelName}CreationAttrs = Omit<Optional<I${modelName}Attrs, ${optionalCreationAttrs
        .map((attr) => `'${attr}'`)
        .join('|')}>, ${modelIntfAssocsAlias.map((attr) => `'${attr}'`).join('|')}> & {${modelIntfAssocsCreation.join(
        '',
      )}};`,
    )
  } else {
    createModelAttrType.push(
      `export type ${modelName}CreationAttrs = Optional<I${modelName}Attrs, ${optionalCreationAttrs
        .map((attr) => `'${attr}'`)
        .join('|')}>;`,
    )
  }

  modelStatic.push(assoc.length > 0 ? `assoc: ${modelName}Assoc;` : '')
  modelStatic.push(alias.length > 0 ? `alias: ${modelName}Alias;` : '')
  modelStatic.push('};')
  modelIntf.push('}')

  modelAttrIntf.push(...modelIntfAttrs)
  modelAttrIntf.push(...modelIntfAssocs)
  modelAttrIntf.push('}')
  imports.push(...assocImports)

  const output: string[] = [
    printWarning(),
    ..._.uniq(imports),
    ...constName,
    ...createModelAttrType,
    ...modelAttrIntf,
    ...modelIntf,
    ...modelDef,
    ...attrsType,
    ..._.uniq(buildAssocType(assocType, modelName)),
    ..._.uniq(buildAliasType(aliasType, modelName)),
    ..._.uniq(buildAssoc(assoc, staticModelInstanceName)),
    ...attrs,
    ..._.uniq(buildAlias(alias, staticModelInstanceName)),
    ...modelStatic,
    ...(isNotEmptyInit ? modelInit : []),
  ]
  return format(output.join(''))
}

const isOptionalCreationAttrs = (opt: ModelAttributeColumnOptions): boolean => {
  const isCreationAttr = opt.allowNull === false && opt.defaultValue === undefined
  return !isCreationAttr
}

const processAttrs = (
  def: ICreatorDefinition,
  modelName: string,
  staticModelInstanceName: string,
  imports: string[],
): [string[], string[], string[], string[], string[]] => {
  const attrs: string[] = []
  const attrsType: string[] = []
  const modelAttrIntf: string[] = []
  const modelDef: string[] = []
  const optionalCreationAttrs: string[] = []

  attrs.push(`${staticModelInstanceName}.attrs = {`)
  attrsType.push(`type ${modelName}Attrs = {`)

  Object.entries(def.attributes).forEach(([k, v]) => {
    const modelAttrs = v as ModelAttributeColumnOptions
    const camelCaseKey = _.camelCase(k)

    attrs.push(`${camelCaseKey}: '${camelCaseKey}',`)
    attrsType.push(`${camelCaseKey}: '${camelCaseKey}';`)
    const attrNullable =
      !modelAttrs.autoIncrement &&
      (modelAttrs.allowNull === undefined || modelAttrs.allowNull === true) &&
      (modelAttrs.defaultValue === undefined || modelAttrs.defaultValue === null)

    if (isOptionalCreationAttrs(modelAttrs)) {
      optionalCreationAttrs.push(camelCaseKey)
    }
    modelAttrIntf.push(
      `${modelAttrs.autoIncrement === true ? 'readonly' : ''} ${camelCaseKey}: ${sequelizeToTsType(
        modelAttrs.type,
        modelAttrs.values as string[],
        attrNullable,
      )};`,
    )
    modelDef.push(`${camelCaseKey}:{\n`)
    modelDef.push(`field: '${k}',\n`)
    modelDef.push(`type: DataTypes.${handleAttrType(modelAttrs.type)},\n`)
    modelDef.push(
      `allowNull: ${modelAttrs.allowNull === true || modelAttrs.allowNull === undefined ? 'true' : 'false'},\n`,
    )
    modelDef.push(`${modelAttrs.primaryKey === true ? 'primaryKey: true,\n' : ''}`)
    modelDef.push(`${modelAttrs.autoIncrement === true ? 'autoIncrement: true,\n' : ''}`)
    modelDef.push(`${modelAttrs.validate ? `validate: ${JSON.stringify(modelAttrs.validate)},\n` : ''}`)
    modelDef.push(`${modelAttrs.values ? `values: ${JSON.stringify(modelAttrs.values)},\n` : ''}`)
    modelDef.push(
      `${
        modelAttrs.defaultValue !== undefined
          ? `defaultValue: ${handleDefaultValue(camelCaseKey, imports, modelAttrs.defaultValue)},\n`
          : ''
      } `,
    )
    modelDef.push(`${modelAttrs.references ? `references: ${JSON.stringify(modelAttrs.references)},\n` : ''} `)
    modelDef.push('},\n')
  })

  attrs.push('};')
  attrsType.push('};')
  return [attrs, attrsType, modelAttrIntf, modelDef, optionalCreationAttrs]
}

const handleDefaultValue = (key: string, importsArr: string[], defaultValue?: unknown): string => {
  if (key === 'sessionId') {
    importsArr.push("import uuidv4 from 'uuid/v4';")
    return 'uuidv4'
  }
  if ((defaultValue as Record<string, unknown>)?.fn === 'NOW') {
    return "fn('NOW')"
  }
  return JSON.stringify(defaultValue)
}

const buildAssociations = (
  modelName: string,
  staticModelInstanceName: string,
  assocDefs?: IAssociation[],
): string[][] => {
  const assocImports: string[] = []
  const modelIntfAssocs: string[] = []
  const modelIntfAssocsCreation: string[] = []
  const modelIntfAssocsAlias: string[] = []
  const assocInit: string[] = []
  const assoc: string[] = []
  const aliases: string[] = []
  const assocType: string[] = []
  const aliasType: string[] = []
  const res = [
    assocImports,
    modelIntfAssocs,
    assocInit,
    assoc,
    aliases,
    assocType,
    aliasType,
    modelIntfAssocsCreation,
    modelIntfAssocsAlias,
  ]
  if (assocDefs === undefined) {
    return res
  }

  assocDefs.forEach((assocDef) => {
    const isMany = assocDef.assocType === AssocType.BelongsToMany || assocDef.assocType === AssocType.HasMany
    const [pascalTarget, targetStaticName] = parseModelName(assocDef.assocModelName)
    const defaultAlias = `${_.camelCase(assocDef.foreignKey)}${pascalTarget}${isMany ? 's' : ''}`
    const alias = assocDef.as ? assocDef.as : defaultAlias
    assocImports.push(
      `import { I${pascalTarget}Attrs, ${targetStaticName}, ${pascalTarget}CreationAttrs } from './${pascalTarget}';`,
    )

    assocInit.push(`${staticModelInstanceName}.${assocDef.assocType}(${targetStaticName}, {`)
    assocInit.push(`foreignKey: '${assocDef.foreignKey}',`)
    assocInit.push(`as: '${alias}',`)
    if (assocDef.through !== undefined) {
      const [pascalThrough, throughStaticName] = parseModelName(assocDef.through)
      assocImports.push(
        `import { I${pascalThrough}Attrs, ${throughStaticName}, ${pascalThrough}CreationAttrs } from './${pascalThrough}';`,
      )
      assocInit.push(`through: ${throughStaticName},`)
      assocInit.push(`otherKey: ${targetStaticName}.primaryKeyAttribute,`)
    }
    if (assocDef.targetKey !== undefined) {
      assocInit.push(`targetKey: '${assocDef.targetKey}',`)
    }
    if (assocDef.sourceKey !== undefined) {
      assocInit.push(`sourceKey: '${assocDef.sourceKey}',`)
    }
    assocInit.push('});')

    modelIntfAssocsAlias.push(alias)
    modelIntfAssocsCreation.push(`${alias}?: ${pascalTarget}CreationAttrs${isMany ? '[]' : ''};`)
    modelIntfAssocs.push(`${alias}?: I${pascalTarget}Attrs${isMany ? '[]' : ''};`)
    assoc.push(`${alias}: (): typeof ${targetStaticName} => ${targetStaticName},`)
    assocType.push(`${alias}: () => typeof ${targetStaticName};`)
    aliases.push(`${alias}: '${alias}',`)
    aliasType.push(`${alias}: '${alias}';`)
  })

  return [
    _.uniq(assocImports),
    modelIntfAssocs,
    assocInit,
    assoc,
    aliases,
    assocType,
    aliasType,
    modelIntfAssocsCreation,
    modelIntfAssocsAlias,
  ]
}

const parseModelName = (modelName: string): string[] => {
  const model = modelName.endsWith('Model') ? modelName : `${modelName}Model`
  const camelModel = _.camelCase(model)
  const pascalModel = camelModel[0].toUpperCase().concat(camelModel.substring(1))
  const modelStaticName = `${camelModel}Static`
  return [pascalModel, modelStaticName]
}

const buildAssoc = (assoc: string[], staticModelName: string): string[] => {
  if (assoc.length === 0) {
    return []
  }
  return [`${staticModelName}.assoc = {`, ...assoc, '};']
}

const buildAssocType = (assoc: string[], modelName: string): string[] => {
  if (assoc.length === 0) {
    return []
  }
  return [`type ${modelName}Assoc = {`, ...assoc, '};']
}

const buildAlias = (alias: string[], staticModelName: string): string[] => {
  if (alias.length === 0) {
    return []
  }
  return [`${staticModelName}.alias = {`, ...alias, '};']
}

const buildAliasType = (alias: string[], modelName: string): string[] => {
  if (alias.length === 0) {
    return []
  }
  return [`type ${modelName}Alias = {`, ...alias, '};']
}

const handleAttrType = (seqType: DataType): string => {
  const key = (seqType as AbstractDataType).key
  const len: number = (seqType as unknown as Record<string, number>)?._length
  const unsigned: boolean = (seqType as unknown as Record<string, boolean>)._unsigned
  switch (key) {
    case 'STRING':
      return `STRING${len ? `(${len})` : ''}`
    case 'INTEGER':
      return `INTEGER${unsigned === true ? '.UNSIGNED' : ''}${len ? `(${len})` : ''}`
    case 'FLOAT':
      return `FLOAT${unsigned === true ? '.UNSIGNED' : ''}${len ? `(${len})` : ''}`
    case 'BOOLEAN':
      return 'BOOLEAN'
    case 'DATE':
      return 'DATE'
    case 'DATEONLY':
      return 'DATEONLY'
    case 'TEXT':
      return 'TEXT'
    case 'BIGINT':
      return 'BIGINT'
    case 'ENUM':
      return 'ENUM'
    case 'JSON':
      return 'JSON'
    default:
      throw Error(`Unhandled type key: ${key}`)
  }
}

const sequelizeToTsType = (seqType: DataType, values?: string[], allowNull = true): string => {
  const k = (seqType as AbstractDataType).key
  const t: string[] = ['STRING', 'BOOLEAN', 'INTEGER', 'DATE', 'TEXT', 'BIGINT', 'ENUM', 'JSON']
  if (!t.includes(k)) {
    printDebug('seqType: ', seqType.toString({}))
    printDebug('seqType valueOf: ', seqType.valueOf())
  }
  const sqlType = seqType.toString({})
  const parseSqlType = (type: string): string => {
    if (type.includes('CHAR') || type.includes('TEXT') || type.includes('STRING')) {
      return 'string'
    }
    if (type.includes('INTEGER') || type.includes('BIGINT') || type.includes('FLOAT')) {
      return 'number'
    }
    if (type.includes('BOOLEAN')) {
      return 'boolean'
    }
    if (type.includes('DATE')) {
      return 'Date'
    }
    if (type.includes('JSONTYPE')) {
      return 'Record<string, unknown>'
    }
    if (type.includes('ENUM')) {
      if (values === undefined) {
        throw new Error('ENUM type with no values')
      }
      return values.map((v) => `'${v}'`).join(' | ')
    }
    throw new Error(`unhandled type: ${type}`)
  }
  return `${parseSqlType(sqlType)}${allowNull ? ' | null' : ''}`
}

const printWarning = (): string => {
  const warning: string[] = []
  warning.push('/** ------------------  This is an auto-generated file. Do not edit.  ------------------  */\n')
  return warning.join('')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
