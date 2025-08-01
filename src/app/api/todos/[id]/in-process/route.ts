import 'reflect-metadata'
import { NextRequest, NextResponse } from "next/server"
import { TodosRepository } from '@/lib/db/repositories/todos-repository'
import { Container } from 'typedi'
import { UpdateTodo } from '@/lib/db/schema/todos'

const todosRepository = Container.get(TodosRepository)
export async function PUT(request: NextRequest, { params }: { params:  Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const userId = request.headers.get('x-user-id')
    const body: UpdateTodo = await request.json()

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { description } = body

    if (!description) {
      return NextResponse.json({ message: 'Bad Request' }, { status: 400 })
    }

    const todo = await todosRepository.getTodoById(parseInt(id))

    if (!todo) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }

    if (todo.userId !== parseInt(userId)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await todosRepository.updateTodo(parseInt(id), { description, state: 'IN_PROGRESS' })

    return NextResponse.json({}, { status: 200 })
  } catch(e) {
    console.warn(e)
    return NextResponse.json({ message: 'Internal Server Error'}, { status: 500 })
  }
}
