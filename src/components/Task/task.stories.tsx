import type { Meta, StoryObj } from '@storybook/react';
import { Task } from './Task';
// import { Provider } from "react-redux";
import { AppRootStateType } from "../../state/store";
import { useSelector } from "react-redux";
import { ReduxStoreProviderDecorator } from "../../stories/decorators/ReduxStoreProviderDecorator";
import { AddTaskTC } from "../../state/reducers/tasks/tasks-reducer";
import { useEffect } from "react";
import { TaskPriorities, TaskStatuses, TaskTypeApi } from "../../api/tasks-api";
import { todoListId1 } from "../../state/initialState/idState";
import { useAppDispatch } from "../../state/hooks/hooks-selectors";


//done/ not done
const meta: Meta<typeof Task> = {
  //как пропсы
  title: 'TODOLISTS/Task',
  component: Task,
  tags: ['autodocs'],
  argTypes: {
    //тут можно писать callBack вместо args
  },
  args: {
    task: {
      id: '12wsdewfijdei', title: 'JS', description: "", completed: true, status: TaskStatuses.Completed,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      todoListId: "",
      order: 1,
      addedDate: ""
    },
    todoListsId: 'fgdosrg8rgju'
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
  decorators: [ReduxStoreProviderDecorator]
};

export default meta;
type Story = StoryObj<typeof Task>;

export const TaskNotDoneStory: Story = {}; //cтатика

export const TaskDoneStory: Story = { ///статика
  args: {
    task: {
      id: '12wsdewfijdei', title: 'CSS', description: "", completed: true, status: TaskStatuses.Completed,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      todoListId: "",
      order: 1,
      addedDate: ""
    },
    //переопределение пропса taskl
  },
};

// const TaskExample = () => { //пример живой таски без стора
//   let [task, setTask] = useState({ id: '12wsdewfijdei', title: 'JS', isDone: false })
//   return <Task task={task} todoListsId={"fgdosrg8rgju"}
//     сhangeTaskStatus={() => setTask({ ...task, isDone: !task.isDone })}
//     changeTaskTitle={(todoListsId, title) => setTask({ ...task, title: title })}
//     removeTask={action("removeTask")}
//   />
// }

// export const TaskStory: Story = {

//   render: () => {
//     return <TaskExample />
//   }
// };


const TaskWithRedux = () => {
  let task = useSelector<AppRootStateType, TaskTypeApi>(state => state.tasks[todoListId1][0])
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(AddTaskTC("NEW TITLE", "1"));
  }, []);//один раз только при монтировании компонента

  // todolistId1 взято из декоратора[ReduxStoreProviderDecorator] - первое значение просто для демонстрации
  if (!task) task = {
    id: "nnn", title: "Oops", description: "", completed: true, status: TaskStatuses.Completed,
    priority: TaskPriorities.Low,
    startDate: "",
    deadline: "",
    todoListId: "",
    order: 1,
    addedDate: ""
  } //дефолтная таска
  return <Task todoListsId={"todolistId1"} task={task} disabled={true} />
}

export const TaskWithReduxStory: Story = { //интерактив
  render: () => < TaskWithRedux />
};
