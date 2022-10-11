import { database } from '../src/db_scripts'

export const clearAll = async (tablesToDelete?: string[]): Promise<void> => {
  const db = database.getQueryInterface()
  const tables = tablesToDelete ?? ['purchase_history', 'restaurant_time', 'menu', 'user', 'restaurant']
  for (const table of tables) {
    await db.bulkDelete(table, {})
  }
}

export const randomInt = (min: number, max: number): number => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}
