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
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd'

import { Check } from 'lucide-react'
import { Loader } from 'lucide-react'
import { Pickaxe } from 'lucide-react'
import { Plus } from 'lucide-react'
import { Trash } from 'lucide-react'

import TodoDialog from '@/components/todo-dialog'

import { Todo } from '@/types/stores/todos.types'

export default function Todos() {
  const [isTodoDialogOpen, setIsTodoDialogOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const { todos, getTodos, deleteTodo, updateTodo, updateTodosOrder, moveTodoInTodo, moveTodoInDone, moveTodoInProgress  } = useTodosStore(s => s)


  type ColumnId = 'TO_DO' | 'IN_PROGRESS' | 'DONE'
  type TodosState = Record<ColumnId, Todo[]>

  const [todosState, setTodosState] = useState<TodosState>({
    TO_DO: [],
    IN_PROGRESS: [],
    DONE: []
  })

  useEffect(() => {
    getTodos()
  }, [])

  useEffect(() => {
    if (todos.length > 0) {
      const todo = todos.filter(todo => todo.state === 'TO_DO')
      const inProgress = todos.filter(todo => todo.state === 'IN_PROGRESS')
      const done = todos.filter(todo => todo.state === 'DONE')

      setTodosState({
        TO_DO: todo,
        IN_PROGRESS: inProgress,
        DONE: done
      })

    }
  }, [todos])

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id)
  }

  const handleUpdateTodo = () => {
    if (editingTodo) {
      updateTodo(editingTodo)
      setEditingTodo(null)
    }
  }

  const todoTemplate = (item: Todo, index: number) => {
    return (
      <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            className="relative"
          >
            <Button
              size="icon"
              variant="ghost"
              className="text-red-500 absolute top-[-2px] right-[-3px]"
              onClick={() => handleDeleteTodo(item.id) }
            >
              <Trash />
            </Button>
            <CardContent onDoubleClick={() => setEditingTodo(item)}>
              {editingTodo && editingTodo.id === item.id ?
              <div className='flex flex-col justify-center items-center gap-y-2'>
               <Textarea value={editingTodo.description} onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value})} />
               <Button
                 variant="outline"
                 onClick={() => handleUpdateTodo() }
               >
                 Save
               </Button>
              </div>
               :
                item.description}
            </CardContent>
          </Card>

        )}
      </Draggable>
    )
  }

  const updatedTodosOrder = (columnId: ColumnId, todos: Todo[]) => {
    const orderPayload = todos.map((todo, index) => ({
      id: todo.id,
      order: index
    }))

    updateTodosOrder(columnId, orderPayload)
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceId = source.droppableId as ColumnId;
    const destId = destination.droppableId as ColumnId;

    const sourceClone = Array.from(todosState[sourceId]);
    const destClone = Array.from(todosState[destId]);

    if (sourceId === destId) {
      const [moved] = sourceClone.splice(source.index, 1);
      sourceClone.splice(destination.index, 0, moved);

      setTodosState(prev => ({
        ...prev,
        [sourceId]: sourceClone,
      }));

      updatedTodosOrder(sourceId, sourceClone)
    } else {
      const [moved] = sourceClone.splice(source.index, 1);
      destClone.splice(destination.index, 0, moved);

      switch(destId) {
        case 'TO_DO':
          moveTodoInTodo(moved.id)
          break;
        case 'IN_PROGRESS':
          moveTodoInProgress(moved.id)
          break;
        case 'DONE':
         moveTodoInDone(moved.id)
         break
      }

      setTodosState(prev => ({
        ...prev,
        [sourceId]: sourceClone,
        [destId]: destClone,
      }));

      updatedTodosOrder(sourceId, sourceClone)
      updatedTodosOrder(destId, destClone)
    }
  }


  return (
    <>
      <DragDropContext
        onDragEnd={onDragEnd}
      >
        <div className='grid grid-cols-3 gap-4 w-full h-full justify-center items-center p-5'>
          <Card className='h-full pb-0'>
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
                    {todosState.TO_DO.map((todo, index) => todoTemplate(todo, index))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
              <Button variant="ghost" onClick={() => setIsTodoDialogOpen(true)}>
                Add
                <Plus />
              </Button>
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
                    {todosState.IN_PROGRESS.map((todo, index) => todoTemplate(todo, index))}
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
                    {todosState.DONE.map((todo, index) => todoTemplate(todo, index))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
        </div>
      </DragDropContext>
      <TodoDialog open={isTodoDialogOpen} onOpenChange={setIsTodoDialogOpen} />
    </>
  )
}
