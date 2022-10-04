import {
  IRestaurantTimeModelAttrs,
  RestaurantTimeModelCreationAttrs,
  RestaurantTimeModelStatic,
  restaurantTimeModelStatic,
} from '~/src/models/RestaurantTimeModel'
import { BaseSeeder } from './base.seeder'

interface IRestaurantTimeSeedOpts {
  dayOfWeek: number
  openingHour: number
  closingHour: number
  restaurantId: number
  preset?: ERestaurantTimePreset
}

export enum ERestaurantTimePreset {
  Default,
}

const restaurantTimePresets = {
  [ERestaurantTimePreset.Default]: (opts: IRestaurantTimeSeedOpts): Partial<RestaurantTimeModelCreationAttrs> => {
    return {
      dayOfWeek: opts.dayOfWeek,
      openingHour: opts.openingHour,
      closingHour: opts.closingHour,
      restaurantId: opts.restaurantId,
    }
  },
}

export class RestaurantTimeSeeder extends BaseSeeder<
  RestaurantTimeModelStatic,
  IRestaurantTimeModelAttrs,
  IRestaurantTimeSeedOpts
> {
  public constructor() {
    super(restaurantTimeModelStatic)
  }

  protected seedInternal(opts: IRestaurantTimeSeedOpts): () => Promise<IRestaurantTimeModelAttrs> {
    return () => {
      let m: Partial<RestaurantTimeModelCreationAttrs>
      try {
        m = restaurantTimePresets[opts.preset ?? ERestaurantTimePreset.Default](opts)
      } catch (err) {
        throw new Error('Unhandled presets')
      }
      return this.create(m)
    }
  }
}
