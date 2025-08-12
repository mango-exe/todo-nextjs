import { randomBytes } from 'crypto'

export function generateToken (length: number = 32): { token: string, expiry: Date } {
  const buffer = randomBytes(length)
  const token = buffer.toString('base64')
  const expiry = new Date(Date.now() + 1000 * 60 * 60)

  return { token, expiry }
}
