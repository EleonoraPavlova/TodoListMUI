import React, { memo, useCallback } from 'react'
import { AddItemForm } from 'components/AddItemForm'
import { TodolistDomain } from 'common/types'
import { TodolistTitle } from 'components/TodolistTitle'
import { TodolistButtons } from 'components/TodolistButtons'
import { Tasks } from 'components/Tasks'
import { useActions } from 'common/hooks'
import { tasksThunks } from 'BLL/reducers/tasksSlice'

type Props = {
  todolist: TodolistDomain
  demo?: boolean //moc state
}

export const TodolistPage: React.FC<Props> = memo(({ todolist, demo = false }) => {
  let { title, entityStatus, id, filter } = todolist

  const loading = entityStatus === 'loading'

  const { addTaskTC } = useActions(tasksThunks)

  const addItem = useCallback(
    (title: string) => {
      addTaskTC({ title, todoListId: id })
    },
    [addTaskTC, id]
  )

  return (
    <>
      <TodolistTitle todolist={todolist} loading={loading} />
      <AddItemForm addItem={addItem} disabled={loading} />
      <Tasks id={id} filter={filter} />
      <TodolistButtons loading={loading} filter={filter} id={id} title={title} />
    </>
  )
})
