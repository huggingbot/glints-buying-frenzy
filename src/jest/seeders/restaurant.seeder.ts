import {
  IRestaurantModelAttrs,
  RestaurantModelCreationAttrs,
  RestaurantModelStatic,
  restaurantModelStatic,
} from '~/src/models/RestaurantModel'
import { BaseSeeder } from './base.seeder'

interface IRestaurantSeedOpts {
  preset?: ERestaurantPreset
}

export enum ERestaurantPreset {
  Default,
}

const restaurantPresets = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [ERestaurantPreset.Default]: (_: IRestaurantSeedOpts): Partial<RestaurantModelCreationAttrs> => {
    return {
      restaurantName: 'myrestaurant',
      cashBalance: 100,
    }
  },
}

export class RestaurantSeeder extends BaseSeeder<RestaurantModelStatic, IRestaurantModelAttrs, IRestaurantSeedOpts> {
  public constructor() {
    super(restaurantModelStatic)
  }

  protected seedInternal(opts: IRestaurantSeedOpts): () => Promise<IRestaurantModelAttrs> {
    return () => {
      let m: Partial<RestaurantModelCreationAttrs>
      try {
        m = restaurantPresets[opts.preset ?? ERestaurantPreset.Default](opts)
      } catch (err) {
        throw new Error('Unhandled presets')
      }
      return this.create(m)
    }
  }
}
