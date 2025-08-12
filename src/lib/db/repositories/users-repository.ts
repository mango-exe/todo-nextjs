import { eq } from 'drizzle-orm'
import { users, User, NewUser } from '../schema/users'
import { Service, Inject } from 'typedi'
import { DBConnection } from '../index'

@Service()
export class UsersRepository {
  constructor (@Inject(() => DBConnection) private readonly connection: DBConnection) {}

  async getUsers (): Promise<User[]> {
    return await this.connection.client.select().from(users)
  }

  async getUserById (id: number): Promise<User | null> {
    const result = await this.connection.client.select().from(users).where(eq(users.id, id))
    return result[0] || null
  }

  async getUserByEmail (email: string): Promise<User | null> {
    const result = await this.connection.client.select().from(users).where(eq(users.email, email))
    return result[0] || null
  }

  async getUserByToken (token: string): Promise<User | null> {
    const result = await this.connection.client.select().from(users).where(eq(users.token, token))
    return result[0] || null
  }

  async createUser (user: NewUser): Promise<User> {
    await this.connection.client.insert(users).values(user)
    const result = await this.connection.client.select().from(users).where(eq(users.email, user.email))
    return result[0]
  }

  async updateUser (id: number, user: Partial<User>): Promise<User> {
    await this.connection.client.update(users).set(user).where(eq(users.id, id))
    const result = await this.connection.client.select().from(users).where(eq(users.id, id))
    return result[0]
  }

  async deleteUser (id: number): Promise<void> {
    await this.connection.client.update(users).set({ enabled: false }).where(eq(users.id, id))
  }
}
