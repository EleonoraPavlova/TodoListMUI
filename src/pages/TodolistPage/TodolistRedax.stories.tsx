
import type { Meta, StoryObj } from '@storybook/react';
import { TodolistRedax } from './TodolistRedax';
import { ReduxStoreProviderDecorator } from "../../stories/decorators/ReduxStoreProviderDecorator";
import { useSelector } from "react-redux";
import { AddTodolistAC, TodolistDomainTypeApi } from "../../state/reducers/todolists/todolists-reducer";
import { useLayoutEffect } from "react";
import { useAppDispatch } from "../../state/hooks/hooks-selectors";
import { todoListId1 } from "../../state/initialState/idState";
import { AppRootStateType } from "../../state/store";


const meta: Meta<typeof TodolistRedax> = {
  title: 'TODOLISTS/TodolistRedax',
  component: TodolistRedax,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    todolists: {
      id: todoListId1, title: "HTML&CSS", filter: "all", addedDate: "", order: 1, entityStatus: "idle"
    }
  },
  decorators: [ReduxStoreProviderDecorator]
};

export default meta;
type Story = StoryObj<typeof TodolistRedax>;

//тут просто вместо листа заглушка div стоит
// const TodolistStoryRedux = () => {
//   let todoListsId = useSelector<AppRootStateType, TodolistType>(state => state.todolists[0])
//   const dispatch = useDispatch()

//   if (!todoListsId) {
//     return <div> oops</div>
//   }
//   return <TodolistRedax todoLists={todoListsId} />
// }

// export const TodolistStory: Story = {
//   render: () =>
//     <div style={{ width: '300px', display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
//       < TodolistStoryRedux />
//     </div>
// };



//добавить todolist после того, как удалили последний из state
const TodolistStoryRedux = () => {
  let todoLists = useSelector<AppRootStateType, TodolistDomainTypeApi[]>(state => state.todolist)
  const dispatch = useAppDispatch()
  console.log("todoLists", todoLists)

  useLayoutEffect(() => {
    if (todoLists.length === 0) {
      dispatch(AddTodolistAC({ id: todoListId1, title: "CSS", addedDate: "", order: 1 }))
    }
  })
  return !todoLists[0] ? <> </> : <TodolistRedax todolists={todoLists[0]} />
}

export const TodolistStory: Story = {
  render: () =>
    <div style={{ width: '300px', display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      < TodolistStoryRedux />
    </div>
};



