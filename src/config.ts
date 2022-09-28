import dotenv from 'dotenv'
dotenv.config()

export const expressConfig = {
  port: Number(process.env.PORT),
}

export const appConfig = {
  expressConfig,
}
