import { Op } from 'sequelize'
import { StaticModel } from '~/src/db_scripts/index'

export abstract class BaseSeeder<Model extends StaticModel, DataJson, SeedOpts> {
  protected promiseQueue: Array<() => Promise<DataJson>>
  protected created: DataJson[]
  protected staticModel: Model

  constructor(staticModel: Model) {
    this.staticModel = staticModel
    this.promiseQueue = []
    this.created = []
  }

  protected abstract seedInternal(opts: SeedOpts): () => Promise<DataJson>

  public seed(opts: SeedOpts): this {
    this.promiseQueue.push(this.seedInternal(opts))
    return this
  }

  public async up(): Promise<DataJson[]> {
    const res: DataJson[] = []
    while (this.promiseQueue.length > 0) {
      const promise = this.promiseQueue.shift()
      if (promise) {
        res.push(await promise())
      }
    }
    this.created = this.created.concat(res)
    return res
  }

  public async down(): Promise<void> {
    await this.staticModel.destroy({
      where: {
        [this.staticModel.primaryKeyAttribute]: {
          [Op.in]: this.created.map((s) => {
            const pk = s[this.staticModel.primaryKeyAttribute]
            return pk
          }),
        },
      },
    })
    this.created = []
  }

  protected async create(attrs: Parameters<typeof this.staticModel.create>[0]): Promise<DataJson> {
    return (await this.staticModel.create(attrs)).toJSON() as DataJson
  }
}
