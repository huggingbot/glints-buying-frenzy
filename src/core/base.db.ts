import { FindOptions, Identifier, Op, ScopeOptions, Transaction } from 'sequelize'
import { StaticModel } from '~/db_scripts'
import { ILogContext } from './types'

export abstract class BaseDb<
  S extends StaticModel,
  DataJson,
  CreationAttrs extends Record<string, unknown> = Record<string, unknown>,
> {
  public staticModel: S
  protected logContext: ILogContext

  public constructor(logContext: ILogContext, staticModel: S) {
    this.staticModel = staticModel
    this.logContext = logContext
  }

  public async bulkCreate(creationAttrs: CreationAttrs[], transaction?: Transaction): Promise<DataJson[]> {
    return (await this.staticModel.bulkCreate(creationAttrs, { transaction })).map((x) => x.toJSON() as DataJson)
  }

  public async findAllByAttr(attr: string, values: unknown[], scopes?: (string | ScopeOptions)[]): Promise<DataJson[]> {
    const m = scopes === undefined ? this.staticModel : this.staticModel.scope(scopes)
    return (
      await m.findAll({
        where: {
          [attr]: {
            [Op.in]: values,
          },
        },
      })
    ).map((x) => x.toJSON()) as DataJson[]
  }

  public async findAllById(ids: Identifier[], scopes?: (string | ScopeOptions)[]): Promise<DataJson[]> {
    const m = scopes === undefined ? this.staticModel : this.staticModel.scope(scopes)
    return (
      await m.findAll({
        where: {
          [this.staticModel.primaryKeyAttribute]: {
            [Op.in]: ids,
          },
        },
      })
    ).map((x) => x.toJSON()) as DataJson[]
  }

  public async findById(id: Identifier, scopes?: (string | ScopeOptions)[]): Promise<DataJson | null> {
    const m = scopes === undefined ? this.staticModel : this.staticModel.scope(scopes)
    const res = await m.findByPk(id)
    if (!res) {
      return null
    }
    return res.toJSON() as DataJson
  }

  public deleteById(id: Identifier): Promise<number> {
    return this.staticModel.destroy({
      where: {
        [this.staticModel.primaryKeyAttribute]: id,
      },
    })
  }

  public async updateById(id: Identifier, attrs: Partial<DataJson>): Promise<[number, DataJson | null]> {
    const [affectedCnt, affectedRows] = await this.staticModel.update(attrs, {
      where: {
        [this.staticModel.primaryKeyAttribute]: id,
      },
      individualHooks: true,
      returning: undefined,
    })
    if (affectedRows.length !== 1) {
      return [0, null]
    }
    return [affectedCnt, affectedRows[0].toJSON() as DataJson]
  }

  protected async findOne(opts: FindOptions, scopes?: (string | ScopeOptions)[]): Promise<DataJson | null> {
    const m = scopes === undefined ? this.staticModel : this.staticModel.scope(scopes)
    const res = await m.findOne(opts)
    if (!res) {
      return null
    }
    return res.toJSON() as DataJson
  }

  protected async findAll(opts: FindOptions, scopes?: (string | ScopeOptions)[]): Promise<DataJson[]> {
    const m = scopes === undefined ? this.staticModel : this.staticModel.scope(scopes)
    const res = await m.findAll(opts)
    return res.map((x) => x.toJSON()) as DataJson[]
  }
}
