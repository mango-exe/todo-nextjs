import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware (req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (token == null) {
    return NextResponse.redirect(new URL('/', req.url).toString())
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/todos', '/api/todos/:path*']
}
