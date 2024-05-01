import React, { memo, useCallback } from 'react'
import { ButtonCustom } from 'components/ButtonCustom'
import { FilterValues } from 'common/types'
import { useActions } from 'common/hooks'
import { todolistsThunks } from 'BLL/reducers/todolistsSlice'
import { Box } from '@mui/material'

type Props = {
  loading: boolean
  filter: FilterValues
  id: string
  title: string
}

export const TodolistButtons: React.FC<Props> = memo(({ loading, filter, id, title }) => {
  const { updateTodolistTC } = useActions(todolistsThunks)

  const changeTodoListFilter = useCallback(
    (todoListId: string, filter: FilterValues) => {
      updateTodolistTC({ todoListId, title, filter })
    },
    [updateTodolistTC, title]
  )

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: 6 }}>
      <ButtonCustom
        color="info"
        filter={filter === 'all'}
        onClick={() => changeTodoListFilter(id, 'all')}
        children={'All'}
      />
      <ButtonCustom
        color="success"
        filter={filter === 'active'}
        onClick={() => changeTodoListFilter(id, 'active')}
        children={'Active'}
        disabled={loading}
      />
      <ButtonCustom
        color="error"
        filter={filter === 'completed'}
        onClick={() => changeTodoListFilter(id, 'completed')}
        children={'Completed'}
        disabled={loading}
      />
    </Box>
  )
})
