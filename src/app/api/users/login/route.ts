import 'reflect-metadata'
import { NextResponse } from "next/server"
import { UsersRepository } from "@/lib/db/repositories/users-repository"
import { Container } from 'typedi'
import { CreateUser, AuthenticatedUser } from '@/lib/db/schema/users'
import { generateToken } from '@/lib/utils/generate-token'
import bcrypt from 'bcrypt'

const usersRepository = Container.get(UsersRepository)

export async function POST(request: Request) {
  try {
    const body: CreateUser | null = await request.json()

    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const user = await usersRepository.getUserByEmail(email)

    if (!user) {
     return NextResponse.json({ message: 'Incorrect email or password'}, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword)

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Incorrect email or password'}, { status: 401 })
    }

    const { token, expiry } = generateToken()

    const authenticatedUser: AuthenticatedUser  = await usersRepository.updateUser(user.id, { token, expiry })

    return NextResponse.json(authenticatedUser, { status: 200 })
  } catch(e) {
    console.warn(e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
