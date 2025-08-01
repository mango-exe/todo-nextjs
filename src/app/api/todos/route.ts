import 'reflect-metadata'
import { NextResponse } from "next/server"
import { UsersRepository } from "@/lib/db/repositories/users-repository"
import { TodosRepository } from '@/lib/db/repositories/todos-repository'
import { Container } from 'typedi'
import { CreateTodo, NewTodo } from '@/lib/db/schema/todos'

const todosRepository = Container.get(TodosRepository)

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized'}, { status: 401 })
    }

    const todos = await todosRepository.getAllUserTodos(parseInt(userId))

    return NextResponse.json(todos, { status: 200 })
  } catch(e) {
    console.warn(e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id')
    const body: CreateTodo| null = await request.json()

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized'}, { status: 401 })
    }

    if (!body) {
      return NextResponse.json({ message: 'Bad request' }, { status: 400 })
    }

    const { description } = body

    if (!description) {
      return NextResponse.json({ message: 'Bad request' }, { status: 400 })
    }

    const newTodo: NewTodo = {
      userId: parseInt(userId),
      description
    }

    await todosRepository.createTodo(newTodo)

  } catch(e) {
    console.warn(e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
