import { int, mysqlTable, varchar, mysqlEnum, boolean, datetime } from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'
import { users } from './users'

const stateEnum = mysqlEnum('state', ['TO_DO', 'IN_PROGRESS', 'DONE'])

export const todos = mysqlTable('todos', {
  id: int('id').primaryKey().autoincrement(),
  state: stateEnum.notNull().default('TO_DO'),
  description: varchar('description', { length: 255 }).notNull(),
  userId: int('user_id').notNull().references(() => users.id),
  enabled: boolean().notNull().default(true),
  createdAt: datetime().notNull().default(sql`CURRENT_TIMESTAMP`),
  order: int('order').notNull().default(0)

})

export type Todo = typeof todos.$inferSelect
export type NewTodo = Omit<Todo, 'id' | 'createdAt' | 'state' | 'enabled' | 'order'>
export type UpdateTodo = Pick<Todo, 'description'>
export type CreateTodo = Pick<Todo, 'description'>
export type TodosSchemaType = typeof todos
export interface TodosOrder {
  state: 'TO_DO' | 'IN_PROGRESS' | 'DONE'
  order: Array<{ id: string, order: number }>
}
