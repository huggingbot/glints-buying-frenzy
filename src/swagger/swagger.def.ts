import { OpenAPIV3 } from 'openapi-types'
import { Swagger } from '.'
import { BASE_URL } from '../constants'

const swagger: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'CUSTOM API',
    version: '1.0.0',
    description: `Custom Api docs.`,
  },
  servers: [
    {
      url: BASE_URL,
    },
  ],
  paths: Swagger.getPaths(),
}

export default swagger
