import { relations } from 'drizzle-orm'
import { users } from './users'
import { todos } from './todos'

export const toodsRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id],
  })
}))
