'use client'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

import axios from 'axios'

import { SERVER } from '@/lib/config/global'

import { useRouter } from 'next/navigation'

export default function SignUp () {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUp = async () => {
    try {
      const response = await axios.post(`${SERVER}/api/auth/register`, {
        email,
        password
      })

      if (response.status === 201) {
        router.push('/')
      }
    } catch (e) {
      console.warn(e)
    }
  }

  return (
    <div className='h-[100%] w-[100%] flex items-center justify-center'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardAction>
            <Link href='/'>
              Login
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
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Password</Label>
                </div>
                <Input id='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className='flex-col gap-2'>
          <Button className='w-full' onClick={handleSignUp}>
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
