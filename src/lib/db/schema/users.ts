import { int, mysqlTable, varchar, boolean, datetime } from 'drizzle-orm/mysql-core'

export const users = mysqlTable('users', {
  id: int().primaryKey().autoincrement(),
  email: varchar({ length: 255 }).unique().notNull(),
  hashedPassword: varchar({ length: 255 }).notNull(),
  enabled: boolean().notNull().default(true),
  token: varchar({ length: 255 }),
  expiry: datetime()
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type CreateUser = Pick<User, 'email'> & { password: string }
export type AuthenticatedUser = Pick<User, 'id' | 'email' | 'token' | 'expiry'>
export type UsersSchemaType = typeof users
