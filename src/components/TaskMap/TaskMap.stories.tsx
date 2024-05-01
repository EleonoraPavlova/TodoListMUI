import type { Meta, StoryObj } from '@storybook/react'
import { TaskMap } from './TaskMap'
// import { Provider } from "react-redux";
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { TaskPriorities, TaskStatuses } from 'common/emuns'
import { ReduxStoreProviderDecorator } from 'stories/decorators'
import { tasksSelector, tasksThunks } from 'BLL/reducers/tasksSlice'
import { useActions } from 'common/hooks'

const meta: Meta<typeof TaskMap> = {
  //как пропсы
  title: 'TODOLISTS/TaskMap',
  component: TaskMap,
  tags: ['autodocs'],
  argTypes: {
    //тут можно писать callBack вместо args
  },
  args: {
    task: {
      id: '12wsdewfijdei',
      title: 'JS',
      description: '',
      completed: true,
      status: TaskStatuses.Completed,
      priority: TaskPriorities.Low,
      startDate: '',
      deadline: '',
      todoListId: '',
      order: 1,
      addedDate: '',
    },
    todoListId: 'fgdosrg8rgju',
  },
  // decorators: [
  //   (Story) => (
  //     <div style={{ width: "200px" }}>
  //       <Provider store={store}>
  //         <Story />
  //       </Provider>
  //     </div>
  //   ),
  // ],
  decorators: [ReduxStoreProviderDecorator],
}

export default meta
type Story = StoryObj<typeof TaskMap>

export const TaskNotDoneStory: Story = {}

export const TaskDoneStory: Story = {
  args: {
    task: {
      id: '12wsdewfijdei',
      title: 'CSS',
      description: '',
      completed: true,
      status: TaskStatuses.Completed,
      priority: TaskPriorities.Low,
      startDate: '',
      deadline: '',
      todoListId: '',
      order: 1,
      addedDate: '',
    },
  },
}

const TaskWithRedux = () => {
  let task = useSelector(tasksSelector)[0]
  const { addTaskTC } = useActions(tasksThunks)

  useEffect(() => {
    addTaskTC({ title: 'NEW TITLE', todoListId: '1' })
  }, [])

  if (!task)
    task = {
      id: 'nnn',
      title: 'Oops',
      description: '',
      completed: true,
      status: TaskStatuses.Completed,
      priority: TaskPriorities.Low,
      startDate: '',
      deadline: '',
      todoListId: '',
      order: 1,
      addedDate: '',
    } //дефолтная таска
  return <TaskMap todoListId={'todoListId1'} task={task} />
}

export const TaskWithReduxStory: Story = {
  render: () => <TaskWithRedux />,
}
