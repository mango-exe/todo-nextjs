import { eq, and } from 'drizzle-orm'
import { todos, Todo, NewTodo, TodosOrder } from '../schema/todos'
import { Service, Inject } from 'typedi'
import { DBConnection } from '../index'

@Service()
export class TodosRepository {
  constructor (@Inject(() => DBConnection) private readonly connection: DBConnection) {}

  async getTodos (): Promise<Todo[]> {
    return await this.connection.client.select().from(todos).where(eq(todos.enabled, true))
  }

  async getAllUserTodos (userId: number): Promise<Todo[]> {
    return await this.connection.client.select().from(todos).where(
      and(
        eq(todos.enabled, true),
        eq(todos.userId, userId)
      )
    ).orderBy(todos.order)
  }

  async getTodoById (id: number): Promise<Todo | null> {
    const result = await this.connection.client.select().from(todos).where(
      and(
        eq(todos.enabled, true),
        eq(todos.id, id)
      )
    )
    return result[0] || null
  }

  async createTodo (todo: NewTodo): Promise<void> {
    await this.connection.client.insert(todos).values(todo)
  }

  async updateTodo (id: number, todo: Partial<Todo>): Promise<void> {
    await this.connection.client.update(todos).set(todo).where(eq(todos.id, id))
  }

  async updateTodoOrder (todosOrder: TodosOrder): Promise<void> {
    for (const order of todosOrder.order) {
      await this.connection.client.update(todos).set({ order: order.order }).where(
        and(
          eq(todos.id, parseInt(order.id)),
          eq(todos.state, todosOrder.state)
        )
      )
    }
  }

  async deleteTodo (id: number): Promise<void> {
    await this.connection.client.update(todos).set({ enabled: false }).where(eq(todos.id, id))
  }
}
