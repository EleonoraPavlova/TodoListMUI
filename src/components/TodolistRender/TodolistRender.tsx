import { Box, Grid, Paper } from '@mui/material'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import { TodolistPage } from 'features/pages/TodolistPage'
import { TodolistDomain } from 'common/types'
import { todolistsSelectors, todolistsThunks } from 'BLL/reducers/todolistsSlice'
import { AddItemForm } from 'components/AddItemForm'
import { useActions } from 'common/hooks'

type TodoListsForRenderProps = {
  demo?: boolean
}

export const TodoListsForRender: React.FC<TodoListsForRenderProps> = memo(({ demo = false }) => {
  let todolists = useSelector(todolistsSelectors.todolistsSelector)
  const { addTodolistTC } = useActions(todolistsThunks)

  const addTodoList = (title: string) => {
    addTodolistTC(title)
  }

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '26px',
      }}>
      <AddItemForm errorText={'Enter title'} addItem={addTodoList} />
      <Grid
        container
        sx={{ p: '20px', justifyContent: 'space-evenly', alignItems: 'flex-start', gap: '35px' }}>
        {todolists?.map((t: TodolistDomain) => (
          <Paper
            key={t.id}
            sx={{
              p: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
            elevation={8}>
            <TodolistPage todolists={t} demo={demo} />
          </Paper>
        ))}
      </Grid>
    </Box>
  )
})
