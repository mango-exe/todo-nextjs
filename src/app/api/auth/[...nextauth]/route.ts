// app/api/auth/[...nextauth]/route.ts
import 'reflect-metadata'
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { UsersRepository } from "@/lib/db/repositories/users-repository"
import { Container } from "typedi"
import { generateToken } from "@/lib/utils/generate-token"
import type { AuthOptions } from "next-auth"
import type { User } from 'next-auth'

const usersRepository = Container.get(UsersRepository)

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string
        const password = credentials?.password as string

        if (!email || !password) return null

        const user = await usersRepository.getUserByEmail(email)
        if (!user) return null

        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword)

        if (!isPasswordValid) return null

        return {
          id: user.id.toString(),
          email: user.email
        } as User
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
