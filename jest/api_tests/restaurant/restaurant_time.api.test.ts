import { AxiosInstance } from 'axios'
import HttpStatus from 'http-status-codes'
import { DELIVERY_API_URL } from '~/src/constants'
import { database } from '~/src/db_scripts'
import { IRestaurantTime } from '~/src/modules/restaurant/restaurant.types'
import { ERestaurantPreset, RestaurantSeeder } from '../../seeders/restaurant.seeder'
import { ERestaurantTimePreset, RestaurantTimeSeeder } from '../../seeders/restaurant_time.seeder'
import { clearAll, randomInt } from '../../utils'
import { createApiClient, createMockCookie } from '../api_test.utils'
import { MockCookie } from '../mock-cookie'

const endpointURL = `${DELIVERY_API_URL}/restaurants/by-time`

describe('Restaurant Time API Test', () => {
  let apiClient: AxiosInstance
  let mockCookie: MockCookie

  beforeAll(async () => {
    await clearAll()
  })

  beforeEach(() => {
    apiClient = createApiClient()
    mockCookie = createMockCookie()
  })

  afterAll(async () => {
    await database.close()
  })

  describe(`GET ${endpointURL}`, () => {
    const dayOfWeek = 3
    const openingHours = [100, 300]
    const closingHours = [800, 1000]

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
            openingHour: randomInt(openingHours[0], openingHours[1]),
            closingHour: randomInt(closingHours[0], closingHours[1]),
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

    test(`should return ${HttpStatus.OK} with res body containing correct structure`, async () => {
      const url = `${endpointURL}?dayOfWeek=${dayOfWeek}&timeAsMinutes=${randomInt(openingHours[1], closingHours[0])}`
      const res = await apiClient.get(url, {
        headers: {
          Cookie: mockCookie.cookies,
        },
      })
      expect(res.status).toBe(HttpStatus.OK)
      expect(res.data.resultCode).toBe(1)
      expect(res.data.message).toBe('Successfully got restaurants')

      const body = res.data.body as IRestaurantTime[]
      expect(body.length).toBe(restaurantTimeCount)

      body.forEach((item) => {
        expect(item.restaurantName).toBeString()
        expect(item.dayOfWeek).toBe(dayOfWeek)
        expect(item.openingHour).toBeWithin(openingHours[0], openingHours[1])
        expect(item.closingHour).toBeWithin(closingHours[0], closingHours[1])
      })
    })

    test.each`
      dayOfWeek | timeAsMinutes | errorReason
      ${0}      | ${0}          | ${'"dayOfWeek" must be greater than or equal to 1'}
      ${8}      | ${0}          | ${'"dayOfWeek" must be less than or equal to 7'}
      ${1}      | ${-1}         | ${'"timeAsMinutes" must be greater than or equal to 0'}
      ${1}      | ${1440}       | ${'"timeAsMinutes" must be less than or equal to 1439'}
    `(
      `should return ${HttpStatus.BAD_REQUEST}: $errorReason when dayOfWeek is $dayOfWeek and timeAsMinutes is $timeAsMinutes`,
      async ({ dayOfWeek, timeAsMinutes, errorReason }) => {
        try {
          const url = `${endpointURL}?dayOfWeek=${dayOfWeek}&timeAsMinutes=${timeAsMinutes}`
          const res = await apiClient.get(url, {
            headers: {
              Cookie: mockCookie.cookies,
            },
          })
          expect(res).toBeUndefined()
        } catch (err) {
          expect(err.response.status).toBe(HttpStatus.BAD_REQUEST)
          expect(err.response.data.resultCode).toBe(-1)
          expect(err.response.data.error.errorCode).toBe(-1)
          expect(err.response.data.error.errorReason).toBe(errorReason)
        }
      },
    )
  })
})
