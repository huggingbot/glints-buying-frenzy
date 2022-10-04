import { database } from '../db_scripts'

export const clearAll = async (tablesToDelete?: string[]): Promise<void> => {
  const db = database.getQueryInterface()
  const tables = tablesToDelete ?? [
    'purchase_history',
    'restaurant_time',
    'restaurant_menu',
    'menu',
    'user',
    'restaurant',
  ]
  for (const table of tables) {
    await db.bulkDelete(table, {})
  }
}
