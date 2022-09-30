import { Request } from 'express'

export const retrieveIpAddress = (req: Request): string => {
  return req.headers && req.headers['x-forwarded-for'] ? String(req.headers['x-forwarded-for']) : req.ip
}
