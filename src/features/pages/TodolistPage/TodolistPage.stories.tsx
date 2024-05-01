import type { Meta, StoryObj } from '@storybook/react'
import { useLayoutEffect } from 'react'
import { useAppDispatch } from '../../../common/hooks/selectors'
import { useSelector } from 'react-redux'
import { TodolistPage } from './TodolistPage'
import { todoListId1 } from 'BLL/initialState'
import { ReduxStoreProviderDecorator } from 'stories/decorators'
import { todolistsSelectors, todolistsThunks } from 'BLL/reducers/todolistsSlice'
import { Box } from '@mui/material'

const meta: Meta<typeof TodolistPage> = {
  title: 'TODOLISTS/TodolistPage',
  component: TodolistPage,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    todolist: {
      id: todoListId1,
      title: 'HTML&CSS',
      filter: 'all',
      addedDate: '',
      order: 1,
      entityStatus: 'idle',
    },
  },
  decorators: [ReduxStoreProviderDecorator],
}

export default meta
type Story = StoryObj<typeof TodolistPage>

const TodolistStoryRedux = () => {
  let todoLists = useSelector(todolistsSelectors.todolistsSelector)
  const payload = { todolist: { id: todoListId1, title: 'CSS', addedDate: '', order: 1 } }
  const dispatch = useAppDispatch()

  useLayoutEffect(() => {
    if (todoLists.length === 0) {
      dispatch(todolistsThunks.addTodolistTC.fulfilled(payload, '', 'requestId'))
    }
  })
  return !todoLists[0] ? <> </> : <TodolistPage todolist={todoLists[0]} />
}

export const TodolistStory: Story = {
  render: () => (
    <Box
      sx={{
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <TodolistStoryRedux />
    </Box>
  ),
}
