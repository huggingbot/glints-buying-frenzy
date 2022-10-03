import merge from 'lodash/merge'
import { OpenAPIV3 } from 'openapi-types'

class SwaggerDoc {
  private paths: OpenAPIV3.PathsObject<unknown, unknown>

  constructor() {
    this.paths = {}
  }

  register(path: string, method: OpenAPIV3.HttpMethods, op: OpenAPIV3.OperationObject = { responses: {} }): void {
    const pathItemObj: OpenAPIV3.PathItemObject = {
      [`/api/delivery/v1${this.formatPath(path)}`]: {
        [method]: op,
      },
    }
    this.paths = merge(this.paths, pathItemObj)
  }

  /**
   * Convert express path to openapi path :id -> {id}
   * @param path
   */
  private formatPath(path: string): string {
    return path
      .split('/')
      .map((p) => {
        if (!p.startsWith(':')) {
          return p
        }
        return `{${p.substring(1)}}`
      })
      .join('/')
  }

  getPaths(): OpenAPIV3.PathsObject<unknown, unknown> {
    return this.paths
  }
}

export const Swagger = new SwaggerDoc()
