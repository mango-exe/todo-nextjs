'use client'
import React, { useEffect, useState } from 'react'
import { useTodosStore } from '@/lib/stores/todos-store'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { DragDropContext, Draggable, Droppable, DropResult, DragStart, BeforeCapture, OnBeforeDragStartResponder } from '@hello-pangea/dnd'

import { Check } from 'lucide-react'
import { Loader } from 'lucide-react'
import { Pickaxe } from 'lucide-react'

export default function Todos() {
  const { getTodos } = useTodosStore(s => s)

  useEffect(() => {
    getTodos()
  }, [])

   type Todo = {
     id: string;
     state: string;
     description: string;
     createdAt: string
  }

  type ColumnId = 'TO_DO' | 'IN_PROGRESS' | 'DONE'
  type TodosState = Record<ColumnId, Todo[]>;

  const [todos, setTodos] = useState<TodosState>({
    TO_DO: [
      {
        id: '1',
        state: 'TO_DO',
        description: 'description 1...',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        state: 'TO_DO',
        description: 'description 2...',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        state: 'TO_DO',
        description: 'description 3...',
        createdAt: new Date().toISOString()
      },
    ],
    IN_PROGRESS: [
      {
         id: '4',
         state: 'IN_PROGRESS',
         description: 'description 4...',
         createdAt: new Date().toISOString()
       },
       {
         id: '5',
         state: 'IN_PROGRESS',
         description: 'description 5...',
         createdAt: new Date().toISOString()
       }
    ],
    DONE: [
      {
        id: '6',
        state: 'DONE',
        description: 'description 6...',
        createdAt: new Date().toISOString()
      },
      {
        id: '7',
        state: 'DONE',
        description: 'description 7...',
        createdAt: new Date().toISOString()
      }
    ]
  })

  const todoTemplate = (item: Todo, index: number) => {
    return (
      <Draggable key={item.id} draggableId={item.id} index={index}>
        {(provided, snapshot) => (
          <Card ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
            <CardContent>
              {item.description}
            </CardContent>
          </Card>
        )}
      </Draggable>
    )
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceId = source.droppableId as ColumnId;
    const destId = destination.droppableId as ColumnId;

    const sourceClone = Array.from(todos[sourceId]);
    const destClone = Array.from(todos[destId]);

    if (sourceId === destId) {
      const [moved] = sourceClone.splice(source.index, 1);
      sourceClone.splice(destination.index, 0, moved);

      setTodos(prev => ({
        ...prev,
        [sourceId]: sourceClone,
      }));
    } else {
      const [moved] = sourceClone.splice(source.index, 1);
      destClone.splice(destination.index, 0, moved);

      setTodos(prev => ({
        ...prev,
        [sourceId]: sourceClone,
        [destId]: destClone,
      }));
    }
  }


  return (
    <DragDropContext
      onDragEnd={onDragEnd}
    >
      <div className='grid grid-cols-3 gap-4 w-full h-full justify-center items-center p-5'>
        <Card className='h-full'>
          <CardTitle className='flex justify-center items-center text-2xl gap-2'>
          <span>To do</span>
          <Pickaxe />
          </CardTitle>
          <CardContent className='h-full'>
            <Droppable droppableId="TO_DO">
              {(provided, snapshot) => (
                <div
                  className='flex flex-col gap-4 h-full'
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {todos.TO_DO.map((todo, index) => todoTemplate(todo, index))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </CardContent>
        </Card>

        <Card className='h-full'>
          <CardTitle className='flex justify-center items-center text-2xl gap-2'>
            <span>In progress</span>
            <Loader />
          </CardTitle>
          <CardContent className='h-full'>
            <Droppable droppableId="IN_PROGRESS">
              {(provided, snapshot) => (
                <div
                  className='flex flex-col gap-4 h-full'
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {todos.IN_PROGRESS.map((todo, index) => todoTemplate(todo, index))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </CardContent>
        </Card>

        <Card className='h-full'>
          <CardTitle className='flex justify-center items-center text-2xl gap-2'>
            <span>Done</span>
            <Check />
          </CardTitle>
          <CardContent className='h-full'>
            <Droppable droppableId="DONE">
              {(provided, snapshot) => (
                <div
                  className='flex flex-col gap-4 h-full'
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {todos.DONE.map((todo, index) => todoTemplate(todo, index))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </CardContent>
        </Card>
      </div>
    </DragDropContext>
  )
}
