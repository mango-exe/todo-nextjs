'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ComponentType, JSX } from 'react'

export function withAuth<T extends JSX.IntrinsicAttributes>(Component: ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const router = useRouter()
    const { data: session, status } = useSession()

    if (status === 'loading') return <div>Loading...</div>
    if (!session) router.push('/')


    return session ? <Component {...props} /> : null
  }
}
