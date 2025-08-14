'use client'
import React, { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import Link from 'next/link'

import { signIn } from 'next-auth/react'

import { useRouter } from 'next/navigation'

export default function Home () {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = async () => {
    try {
      await signIn('credentials', { email, password, redirect: true, callbackUrl: '/todos' })
    } catch (error) {
      console.warn(error)
    }
  }

  return (
    <div className='h-[100%] w-[100%] flex items-center justify-center'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Link href='/signup'>
              Sign Up
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Password</Label>
                </div>
                <Input id='password' type='password' required value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className='flex-col gap-2'>
          <Button className='w-full' onClick={handleSignIn}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
