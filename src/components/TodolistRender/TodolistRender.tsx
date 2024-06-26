import { Box, Paper } from '@mui/material'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import { TodolistPage } from 'features/pages/TodolistPage'
import { TodolistDomain } from 'common/types'
import { todolistsSelectors, todolistsThunks } from 'BLL/reducers/todolistsSlice'
import { AddItemForm } from 'components/AddItemForm'
import { useActions } from 'common/hooks'
import React from 'react'

type Props = {
  demo?: boolean
}

export const TodoListsForRender: React.FC<Props> = memo(({ demo = false }) => {
  let todolists = useSelector(todolistsSelectors.todolistsSelector)
  const { addTodolistTC } = useActions(todolistsThunks)

  const addTodoList = (title: string) => {
    return addTodolistTC(title).unwrap()
  }

  const todolistsMap: JSX.Element[] = todolists.map((t: TodolistDomain) => (
    <React.Fragment key={t.id}>
      <Paper
        sx={{
          padding: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
        elevation={6}>
        <TodolistPage todolist={t} demo={demo} />
      </Paper>
    </React.Fragment>
  ))

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '26px',
      }}>
      <AddItemForm addItem={addTodoList} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'nowrap',
          overflow: 'auto',
          gap: '20px',
          width: '100%',
          padding: '0 15px',
        }}>
        {todolistsMap}
      </Box>
    </Box>
  )
})
