import { ILogContext } from '~/src/core/types'
import { database } from '~/src/db_scripts'
import { RestaurantTimeService } from '~/src/modules/restaurant/restaurant_time.service'
import { ERestaurantPreset, RestaurantSeeder } from '../../seeders/restaurant.seeder'
import { ERestaurantTimePreset, RestaurantTimeSeeder } from '../../seeders/restaurant_time.seeder'
import { clearAll, randomInt } from '../../utils'

describe('Restaurant Time Service Integration Test', () => {
  const logContext: ILogContext = {
    txContext: {
      uuid: '1',
      startTime: new Date(),
      sourceIp: 'sourceIp',
    },
    txType: '',
    metadata: {},
  }
  const restaurantTimeService = new RestaurantTimeService(logContext)

  beforeAll(async () => {
    await clearAll()
  })

  afterAll(async () => {
    await database.close()
  })

  describe('read-only methods', () => {
    const dayOfWeek = 3
    const openingHour = 100
    const closingHour = 1000

    const restaurantSeeder = new RestaurantSeeder()
    const restaurantTimeSeeder = new RestaurantTimeSeeder()
    const restaurantTimeCount = 3
    const restaurantTimeIds: number[] = []

    beforeAll(async () => {
      const restaurant = await restaurantSeeder.seed({ preset: ERestaurantPreset.Default }).up()

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const _ of Array.from({ length: restaurantTimeCount })) {
        const result = await restaurantTimeSeeder
          .seed({
            dayOfWeek,
            openingHour,
            closingHour,
            restaurantId: restaurant[0].restaurantId,
            preset: ERestaurantTimePreset.Default,
          })
          .up()
        restaurantTimeIds.push(result[0].restaurantTimeId)
      }
    })

    afterAll(async () => {
      await restaurantTimeSeeder.down()
      await restaurantSeeder.down()
    })

    describe('getRestaurantsByTime', () => {
      it('Should get all restaurants opening at a certain time', async () => {
        try {
          const restaurantTimes = await restaurantTimeService.getRestaurantsByTime(
            dayOfWeek,
            randomInt(openingHour, closingHour),
          )
          expect(restaurantTimes).toBeDefined()
          expect(restaurantTimes.length).toEqual(restaurantTimeCount)

          restaurantTimes.forEach((restaurantTime) => {
            expect(restaurantTime).toBeDefined()
            expect(restaurantTime.restaurantName).toBeDefined()
            expect(restaurantTime.dayOfWeek).toBeDefined()
            expect(restaurantTime.openingHour).toBeDefined()
            expect(restaurantTime.closingHour).toBeDefined()
          })
        } catch (err) {
          expect(err).toBeUndefined()
        }
      })
    })
  })
})
