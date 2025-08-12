import { createStore, StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { TodosState, TodosStore } from '@/types/stores/todos.types'
import { getTodos, addTodo, updateTodo, updateTodosOrder,  deleteTodo, moveTodoInTodo, moveTodoInProgress, moveTodoInDone } from './actions/todos-actions'
import { useStore } from 'zustand'

export const initialState: TodosState = {
  todos: [],
  count: 0,
  error: null,
  fetching: false,
  fetched: false
}

export const createTodosStore = (
  initState: TodosState = initialState
): StoreApi<TodosStore> => {
  return createStore<
    TodosStore,
    [["zustand/immer", never]]
  >(
    immer((...args) => ({
      ...initState,
      ...addTodo(...args),
      ...getTodos(...args),
      ...updateTodo(...args),
      ...updateTodosOrder(...args),
      ...deleteTodo(...args),
      ...moveTodoInTodo(...args),
      ...moveTodoInProgress(...args),
      ...moveTodoInDone(...args)
    }))
  )
}

export const todosStore = createTodosStore()
export function useTodosStore<T>(selector: (state: TodosStore) => T): T {
  return useStore(todosStore, selector)
}
