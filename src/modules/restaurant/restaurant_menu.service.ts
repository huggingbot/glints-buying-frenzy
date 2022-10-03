import { BaseService } from '~/core/base.service'
import { ILogContext } from '~/core/types'
import { IRestaurantMenuSearch } from './restaurant.types'
import { RestaurantMenuDb } from './restaurant_menu.db'

export class RestaurantMenuService extends BaseService {
  private restaurantMenuDb: RestaurantMenuDb

  public constructor(logContext: ILogContext) {
    super(logContext)
    this.restaurantMenuDb = new RestaurantMenuDb(logContext)
  }

  public async searchRestaurantsAndMenusByName(searchTerm: string): Promise<IRestaurantMenuSearch[]> {
    const result = await this.restaurantMenuDb.findRestaurantsAndMenusByName(searchTerm)
    return result.map(({ searchResult, score }) => ({ searchResult, score }))
  }
}
