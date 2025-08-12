import 'reflect-metadata'
import { NextRequest, NextResponse } from 'next/server'
import { TodosRepository } from '@/lib/db/repositories/todos-repository'
import { Container } from 'typedi'
import { UpdateTodo } from '@/lib/db/schema/todos'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const todosRepository = Container.get(TodosRepository)
export async function PUT (request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    const user = session!.user

    const todo = await todosRepository.getTodoById(parseInt(id))

    if (todo == null) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }

    if (todo.userId !== parseInt(user.id)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await todosRepository.updateTodo(parseInt(id), { state: 'IN_PROGRESS' })

    return NextResponse.json({}, { status: 200 })
  } catch (e) {
    console.warn(e)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
