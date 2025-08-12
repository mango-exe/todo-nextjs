import 'reflect-metadata'
import { NextResponse } from "next/server"
import { TodosRepository } from '@/lib/db/repositories/todos-repository'
import { Container } from 'typedi'
import { CreateTodo, NewTodo } from '@/lib/db/schema/todos'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

const todosRepository = Container.get(TodosRepository)

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user = session!.user

    const todos = await todosRepository.getAllUserTodos(parseInt(user.id))

    return NextResponse.json(todos, { status: 200 })
  } catch(e) {
    console.warn(e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user = session!.user
    const body: CreateTodo| null = await request.json()


    if (!body) {
      return NextResponse.json({ message: 'Bad request' }, { status: 400 })
    }

    const { description } = body

    if (!description) {
      return NextResponse.json({ message: 'Bad request' }, { status: 400 })
    }

    const newTodo: NewTodo = {
      userId: parseInt(user.id),
      description
    }

    await todosRepository.createTodo(newTodo)

    return NextResponse.json({}, { status: 201 })
  } catch(e) {
    console.warn(e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
