import fs from 'fs'
import { join, parse } from 'path'
import prettier from 'prettier'

export const getNamesInDir = (dirPath: fs.PathLike, withExt = false): string[] => {
  try {
    return fs.readdirSync(dirPath).map((file) => {
      const { name, ext } = parse(file)
      return withExt ? name + ext : name
    })
  } catch (err) {
    console.warn(err)
    return []
  }
}

export const printDebug = (msg: string, ...objs: unknown[]): void => {
  if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'local') {
    console.log(msg, ...objs)
  }
}

export const readDefinitions = async <T>(defPath: string): Promise<T[]> => {
  const definitionsFileName = getNamesInDir(defPath)
  const res: T[] = []
  for (const definitionFileName of definitionsFileName) {
    const module = await import(join(defPath, definitionFileName))
    if (!module || !module.definition) {
      throw new Error('Error loading definition. Definition file should have a named export definition')
    }
    const definition = module.definition as T
    res.push(definition)
  }
  return res
}

export const format = (input: string): string => {
  const configPath = prettier.resolveConfigFile.sync()
  if (!configPath) {
    throw Error('Null config')
  }
  const config = prettier.resolveConfig.sync(configPath)
  if (!config) {
    throw Error('Null config')
  }
  return prettier.format(input, Object.assign({}, config, { parser: 'typescript' }))
}
