import { NextRequest, NextResponse } from "next/server"
import { Container } from 'typedi'
import { UsersRepository } from "@/lib/db/repositories/users-repository"
import { getCurrentDate } from "@/lib/utils/current-date"

const usersRepository = Container.get(UsersRepository)

export default async function authenticationMiddleware(request: NextRequest) {
  const token = request.headers.get('Authorization') || request.headers.get('authorization')

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await usersRepository.getUserByToken(token)

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now: Date = getCurrentDate()
  if ((user.expiry as Date) < now) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const response = NextResponse.next()
  response.headers.set('x-user-id', user.id.toString())

  return response
}

export const config = {
  matcher: ['/api/todos', '/api/todos/:path*'],
  runtime: 'nodejs'
}
