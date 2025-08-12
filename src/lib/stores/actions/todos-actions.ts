import { StateCreator } from 'zustand'
import { TodosStore, Todo, TodoState } from '@/types/stores/todos.types'
import axios from 'axios'
import { SERVER } from '@/lib/config/global'

export const getTodos: StateCreator<TodosStore, [], [], { getTodos: () => Promise<void> }> = (set, get) => ({
  getTodos: async () => {
    set({ fetching: true })
    try {
      const response = await axios.get(`${SERVER}/api/todos`)
      const todos = response.data as Todo[]
      set({ todos, fetching: false, fetched: true })
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, fetching: false })
      } else {
        set({ error: 'An unknown error occured', fetching: false })
      }
    }
  }
})

export const addTodo: StateCreator<TodosStore, [], [], { addTodo: (todo: Partial<Todo>) => Promise<void> }> = (set, get) => ({
  addTodo: async (todo: Partial<Todo>) => {
    set({ fetching: true })
    try {
      await axios.post(`${SERVER}/api/todos`, todo)
      const response = await axios.get(`${SERVER}/api/todos`)
      const todos = response.data as Todo[]
      set({ todos, fetching: false, fetched: true })
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, fetching: false })
      } else {
        set({ error: 'An unknown error occured', fetching: false })
      }
    }
  }
})

export const updateTodo: StateCreator<TodosStore, [], [], { updateTodo: (todo: Partial<Todo>) => Promise<void> }> = (set, get) => ({
  updateTodo: async (todo: Partial<Todo>) => {
    try {
      await axios.put(`${SERVER}/api/todos/${todo.id}`, todo)
      const response = await axios.get(`${SERVER}/api/todos`)
      const todos = response.data as Todo[]
      set({ todos, fetching: false, fetched: true })
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, fetching: false })
      } else {
        set({ error: 'An unknown error occured', fetching: false })
      }
    }
  }
})

export const updateTodosOrder: StateCreator<TodosStore, [], [], { updateTodosOrder: (state: TodoState, order: Array<{ id: string, order: number }>) => Promise<void> }> = (set, get) => ({
  updateTodosOrder: async (state: TodoState, order: Array<{ id: string, order: number }>) => {
    try {
      await axios.put(`${SERVER}/api/todos/order`, { state, order })
      const response = await axios.get(`${SERVER}/api/todos`)
      const todos = response.data as Todo[]
      set({ todos, fetching: false, fetched: true })
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, fetching: false })
      } else {
        set({ error: 'An unknown error occured', fetching: false })
      }
    }
  }
})

export const deleteTodo: StateCreator<TodosStore, [], [], { deleteTodo: (id: string) => Promise<void> }> = (set, get) => ({
  deleteTodo: async (id: string) => {
    set({ fetching: true })
    try {
      await axios.delete(`${SERVER}/api/todos/${id}`)
      const response = await axios.get(`${SERVER}/api/todos`)
      const todos = response.data as Todo[]
      set({ todos, fetching: false, fetched: true })
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, fetching: false })
      } else {
        set({ error: 'An unknown error occured', fetching: false })
      }
    }
  }
})

export const moveTodoInTodo: StateCreator<TodosStore, [], [], { moveTodoInTodo: (id: string) => Promise<void> }> = (set, get) => ({
  moveTodoInTodo: async (id: string) => {
    try {
      await axios.put(`${SERVER}/api/todos/${id}/todo`, {})
      const response = await axios.get(`${SERVER}/api/todos`)
      const todos = response.data as Todo[]
      set({ todos, fetching: false, fetched: true })
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, fetching: false })
      } else {
        set({ error: 'An unknown error occured', fetching: false })
      }
    }
  }
})

export const moveTodoInProgress: StateCreator<TodosStore, [], [], { moveTodoInProgress: (id: string) => Promise<void> }> = (set, get) => ({
  moveTodoInProgress: async (id: string) => {
    try {
      await axios.put(`${SERVER}/api/todos/${id}/in-progress`, {})
      const response = await axios.get(`${SERVER}/api/todos`)
      const todos = response.data as Todo[]
      set({ todos, fetching: false, fetched: true })
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, fetching: false })
      } else {
        set({ error: 'An unknown error occured', fetching: false })
      }
    }
  }
})

export const moveTodoInDone: StateCreator<TodosStore, [], [], { moveTodoInDone: (id: string) => Promise<void> }> = (set, get) => ({
  moveTodoInDone: async (id: string) => {
    try {
      await axios.put(`${SERVER}/api/todos/${id}/done`, {})
      const response = await axios.get(`${SERVER}/api/todos`)
      const todos = response.data as Todo[]
      set({ todos, fetching: false, fetched: true })
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, fetching: false })
      } else {
        set({ error: 'An unknown error occured', fetching: false })
      }
    }
  }
})
