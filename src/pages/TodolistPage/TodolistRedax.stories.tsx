import type { Meta, StoryObj } from '@storybook/react'
import { TodolistRedax } from './TodolistRedax'
import { ReduxStoreProviderDecorator } from '../../stories/decorators/ReduxStoreProviderDecorator'
import { addTodolistTC, todolistsSelectors } from '../../state/reducers/todolists/todolistsSlice'
import { useLayoutEffect } from 'react'
import { useAppDispatch } from '../../state/hooks/hooks-selectors'
import { todoListId1 } from '../../state/initialState/idState'
import { useSelector } from 'react-redux'

const meta: Meta<typeof TodolistRedax> = {
  title: 'TODOLISTS/TodolistRedax',
  component: TodolistRedax,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    todolists: {
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
type Story = StoryObj<typeof TodolistRedax>

//тут просто вместо листа заглушка div стоит
// const TodolistStoryRedux = () => {
//   let todoListId = useSelector<AppRootStateType, TodolistType>(state => state.todolists[0])
//   const dispatch = useDispatch()

//   if (!todoListId) {
//     return <div> oops</div>
//   }
//   return <TodolistRedax todoLists={todoListId} />
// }

// export const TodolistStory: Story = {
//   render: () =>
//     <div style={{ width: '300px', display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
//       < TodolistStoryRedux />
//     </div>
// };

//добавить todolist после того, как удалили последний из state
const TodolistStoryRedux = () => {
  let todoLists = useSelector(todolistsSelectors.todolistsSelector)
  const payload = { todolist: { id: todoListId1, title: 'CSS', addedDate: '', order: 1 } }
  const dispatch = useAppDispatch()

  useLayoutEffect(() => {
    if (todoLists.length === 0) {
      dispatch(addTodolistTC.fulfilled(payload, '', 'requestId'))
    }
  })
  return !todoLists[0] ? <> </> : <TodolistRedax todolists={todoLists[0]} />
}

export const TodolistStory: Story = {
  render: () => (
    <div
      style={{
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <TodolistStoryRedux />
    </div>
  ),
}
