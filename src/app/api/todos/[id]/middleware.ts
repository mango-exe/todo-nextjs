import { NextRequest, NextResponse } from 'next/server'
import { Container } from 'typedi'
import { TodosRepository } from '@/lib/db/repositories/todos-repository'

const todosRepository = Container.get(TodosRepository)

export default async function permissionMiddleware(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  const pathname = request.nextUrl.pathname

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const segments = pathname.split('/').filter(Boolean)

  if (segments.length >= 3 && segments[0] === 'api' && segments[1] === 'todos') {
    const id = parseInt(segments[2], 10)
    if (isNaN(id)) {
      return NextResponse.json({ message: 'Invalid todo id' }, { status: 400 })
    }

    let todo
    try {
      todo = await todosRepository.getTodoById(id)
    } catch (e) {
      console.error('DB error:', e)
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }

    if (!todo) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 })
    }

    if (todo.userId !== parseInt(userId, 10)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/todos/:id', '/api/todos/:id/:path*'],
  runtime: 'nodejs'
}
