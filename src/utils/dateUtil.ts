import moment from 'moment-timezone'

export const getCurrentSGTime = (): string => {
  return new Date().toLocaleString('en-GB', { timeZone: 'Asia/Singapore' })
}

export const getCurrentSGDate = (): Date => {
  return moment().tz('Asia/Singapore').toDate()
}
