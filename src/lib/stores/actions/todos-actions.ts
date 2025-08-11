import { StateCreator } from "zustand"
import { TodosStore, Todo } from "@/types/stores/todos.types"
import axios from 'axios'
import { SERVER } from "@/lib/config/global"

export const getTodos: StateCreator<TodosStore, [], [], { getTodos: () => Promise<void>}> = (set, get) => ({
  getTodos: async () => {
    set({ fetching: true })
    try {
      const response = await axios.get(`${SERVER}/api/todos`)
      const todos = response.data as Todo[]
      set({ todos, fetching: false, fetched: true })
    } catch(err: unknown ) {
      if (err instanceof Error) {
        set({ error: err.message, fetching: false })
      } else {
        set({ error: 'An unknown error occured', fetching: false })
      }
    }
  }
})
