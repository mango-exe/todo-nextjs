export type Todo = {
  id: number,
  state: string,
  description: string,
  userId: number
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
}

export type TodosStore = TodosState & TodosActions
