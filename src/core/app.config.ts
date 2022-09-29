import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.join('~', '..', '.env') })

export const expressConfig = {
  port: Number(process.env.PORT),
}

export const appConfig = {
  version: 1,
  expressConfig,
}
