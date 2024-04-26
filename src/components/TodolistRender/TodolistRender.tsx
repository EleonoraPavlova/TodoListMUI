import { Box, Grid, Paper } from '@mui/material'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import { TodolistPage } from 'features/pages/TodolistPage'
import { TodolistDomain } from 'common/types'
import { todolistsSelectors, todolistsThunks } from 'BLL/reducers/todolistsSlice'
import { AddItemForm } from 'components/AddItemForm'
import { useActions } from 'common/hooks'
import React from 'react'

type TodoListsForRenderProps = {
  demo?: boolean
}

export const TodoListsForRender: React.FC<TodoListsForRenderProps> = memo(({ demo = false }) => {
  let todolists = useSelector(todolistsSelectors.todolistsSelector)
  const { addTodolistTC } = useActions(todolistsThunks)

  const addTodoList = (title: string) => {
    addTodolistTC(title)
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
        <TodolistPage todolists={t} demo={demo} />
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
      <AddItemForm errorText={'Enter title'} addItem={addTodoList} />
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
