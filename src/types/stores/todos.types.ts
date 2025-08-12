
export type TodoState = 'TO_DO' | 'IN_PROGRESS' | 'DONE'

export type Todo = {
  id: string,
  state: TodoState,
  description: string,
  userId: string,
  createdAt: Date
}

export type TodosState = {
  todos: Todo[],
  count: number,
  error: string | null,
  fetching: boolean,
  fetched: boolean
}

export type TodosActions = {
  getTodos(): void
  addTodo(todo: Partial<Todo>): void
  updateTodosOrder(state: TodoState, order: { id: string, order: number }[]): void
  updateTodo(todo: Partial<Todo>): void
  deleteTodo(id: string): void
  moveTodoInTodo(id: string): void
  moveTodoInProgress(id: string): void
  moveTodoInDone(id: string): void
}

export type TodosStore = TodosState & TodosActions
