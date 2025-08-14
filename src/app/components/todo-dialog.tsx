import React, { useState } from 'react'
import { useSession } from 'next-auth/react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/app/components/ui/dialog'

import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'
import { Label } from '@/app/components/ui/label'
import { Button } from '@/app/components/ui/button'

import { useTodosStore } from '@/lib/stores/todos-store'

export default function TodoDialog ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [description, setDescription] = useState('')
  const { data: session, status } = useSession()

  const { addTodo } = useTodosStore(s => s)

  const handleAddTodo = () => {
    if (!description) return
    addTodo({ description, userId: session?.user.id })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new TODO</DialogTitle>
        </DialogHeader>
        <div>
          <div className='flex flex-row gap-4 py-4'>
            <div className='flex flex-col w-full gap-4'>
              <Label htmlFor='description' className='text-right'>
                Description
              </Label>
              <Textarea id='description' placeholder='e.g. ' className='h-[10em] col-span-3' value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>
          <div className='flex flex-row justify-between w-full'>
            <Button disabled={!description} onClick={handleAddTodo} variant='outline'>Save</Button>
            <DialogClose>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
