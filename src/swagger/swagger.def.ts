import { OpenAPIV3 } from 'openapi-types'
import { Swagger } from '.'
import pjson from '../../package.json'

const swagger: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'CUSTOM API',
    version: pjson.version,
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
