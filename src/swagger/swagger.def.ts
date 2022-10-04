import { OpenAPIV3 } from 'openapi-types'
import { Swagger } from '.'

const swagger: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'CUSTOM API',
    version: '1.0.0',
    description: `Custom Api docs.`,
  },
  servers: [
    {
      url: 'http://localhost:3010',
    },
  ],
  paths: Swagger.getPaths(),
}

export default swagger
