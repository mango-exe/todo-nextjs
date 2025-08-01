import { relations } from 'drizzle-orm'
import { todos } from './todos'
import { users } from './users'

export const usersRelations = relations(users, ({ many }) => ({
  todos: many(todos)
}))
