import { ILogContext } from '~/src/core/types'
import { database } from '~/src/db_scripts'
import { ERestaurantPreset, RestaurantSeeder } from '../../seeders/restaurant.seeder'
import { ERestaurantTimePreset, RestaurantTimeSeeder } from '../../seeders/restaurant_time.seeder'
import { RestaurantTimeDb } from '~/src/modules/restaurant/restaurant_time.db'
import { clearAll, randomInt } from '../../utils'

describe('Restaurant Time DB Integration Test', () => {
  const logContext: ILogContext = {
    txContext: {
      uuid: '1',
      startTime: new Date(),
      sourceIp: 'sourceIp',
    },
    txType: '',
    metadata: {},
  }
  const restaurantTimeDb = new RestaurantTimeDb(logContext)

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

    describe('findRestaurantsByTime', () => {
      it('Should retrieve all restaurants opening at a certain time', async () => {
        try {
          const restaurantTimes = await restaurantTimeDb.findRestaurantsByTime(
            dayOfWeek,
            randomInt(openingHour, closingHour),
          )
          expect(restaurantTimes).toBeDefined()
          expect(restaurantTimes.length).toEqual(restaurantTimeCount)

          restaurantTimes.forEach((restaurantTime) => {
            expect(restaurantTime).toBeDefined()
            expect(restaurantTime.restaurantTimeId).toBeDefined()
            expect(restaurantTime.restaurantId).toBeDefined()
            expect(restaurantTime.restaurantIdRestaurantModel).toBeDefined()
            expect(restaurantTime.restaurantIdRestaurantModel.restaurantName).toBeDefined()
            expect(restaurantTime.dayOfWeek).toBeDefined()
            expect(restaurantTime.openingHour).toBeDefined()
            expect(restaurantTime.closingHour).toBeDefined()
            expect(restaurantTime.createdAt).toBeDefined()
            expect(restaurantTime.updatedAt).toBeDefined()
          })
        } catch (err) {
          expect(err).toBeUndefined()
        }
      })
    })
  })
})
