import 'reflect-metadata'
import { NextResponse } from 'next/server'
import { Container } from 'typedi'
import { TodosRepository } from '@/lib/db/repositories/todos-repository'
import { TodosOrder } from '@/lib/db/schema/todos'

const todosRepository = Container.get(TodosRepository)

export async function PUT(request: Request) {
  try {
    const body: TodosOrder | null  = await request.json()

    if (!body) {
      return NextResponse.json({ message: 'Bad request' }, { status: 400 })
    }

    const { state, order } = body
    await todosRepository.updateTodoOrder({state, order})

    return NextResponse.json({}, { status: 200 })
  } catch(e) {
    console.warn(e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
