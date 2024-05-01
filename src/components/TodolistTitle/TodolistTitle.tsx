import React, { memo, useCallback } from 'react'
import { IconButton, Typography } from '@mui/material'
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation'
import { EditableSpan } from 'components/EditableSpan'
import { TodolistDomain } from 'common/types'
import { useActions } from 'common/hooks'
import { todolistsThunks } from 'BLL/reducers/todolistsSlice'

type Props = {
  todolist: TodolistDomain
  loading: boolean
}

export const TodolistTitle: React.FC<Props> = memo(({ todolist, loading }) => {
  let { id, title, filter } = todolist
  const { updateTodolistTC, removeTodolistTC } = useActions(todolistsThunks)

  const changeTodolistTitleHandler = useCallback(
    (title: string) => {
      updateTodolistTC({ todoListId: id, title, filter })
    },
    [updateTodolistTC, id]
  )

  const removeTodoListHandler = useCallback(() => {
    removeTodolistTC(id)
  }, [removeTodolistTC, id])

  return (
    <Typography variant={'h6'} align="center" sx={{ fontWeight: 'bold', paddingBottom: '8px' }}>
      <EditableSpan title={title} changeTitle={changeTodolistTitleHandler} isDone={loading} />
      <IconButton
        aria-label="delete"
        size="small"
        onClick={removeTodoListHandler}
        sx={{ ml: '4px' }}
        disabled={loading}>
        <CancelPresentationIcon color={loading ? 'disabled' : 'success'} />
      </IconButton>
    </Typography>
  )
})
