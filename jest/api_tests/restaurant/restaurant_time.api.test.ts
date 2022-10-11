import { AxiosInstance } from 'axios'
import HttpStatus from 'http-status-codes'
import moment from 'moment'
import { DELIVERY_API_URL } from '~/src/constants'
import { database } from '~/src/db_scripts'
import { IRestaurantTime } from '~/src/modules/restaurant/restaurant.types'
import { ERestaurantPreset, RestaurantSeeder } from '../../seeders/restaurant.seeder'
import { ERestaurantTimePreset, RestaurantTimeSeeder } from '../../seeders/restaurant_time.seeder'
import { clearAll, randomInt } from '../../util'
import { createApiClient, createMockCookie } from '../api_test.util'
import { MockCookie } from '../mock_cookie'

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
    const dayOfWeek = 7
    const openingHours = [100, 300]
    const closingHours = [800, 1000]
    const timestamp = moment('Sat Jan 01 2022 08:00:00 GMT+0800 (Singapore Standard Time)').valueOf()

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
      const url = `${endpointURL}?timestamp=${timestamp}`
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
      timestamp       | errorReason
      ${'randomTime'} | ${'"timestamp" must be a number'}
      ${true}         | ${'"timestamp" must be a number'}
    `(
      `should return ${HttpStatus.BAD_REQUEST}: $errorReason when timestamp is $timestamp`,
      async ({ timestamp, errorReason }) => {
        try {
          const url = `${endpointURL}?timestamp=${timestamp}`
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
