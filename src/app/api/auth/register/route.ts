import 'reflect-metadata'
import { NextResponse } from 'next/server'
import { UsersRepository } from '@/lib/db/repositories/users-repository'
import { Container } from 'typedi'
import { CreateUser, NewUser } from '@/lib/db/schema/users'
import bcrypt from 'bcrypt'

const usersRepository = Container.get(UsersRepository)

export async function POST (request: Request) {
  try {
    const body: CreateUser | null = await request.json()

    if (body == null) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user: NewUser = {
      email,
      hashedPassword
    }

    await usersRepository.createUser(user)

    return NextResponse.json({ message: 'Create' }, { status: 201 })
  } catch (e) {
    console.warn(e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
