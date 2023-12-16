import { Paper } from "@mui/material"
import { TodolistRedax } from "../../pages/TodolistPage/TodolistRedax"
import { useAppSelector } from "../../state/hooks/hooks-selectors";
import { memo } from "react";
import { TodolistDomainTypeApi } from "../../state/reducers/todolists/todolists-reducer";

export type TodoListsForRenderProps = {
  demo?: boolean
}

export const TodoListsForRender: React.FC<TodoListsForRenderProps> = memo(({ demo = false }) => {
  //useSelector дает доступ к state
  //записывать так! HE {tasks, todoLists} - cоздается новая копия
  let todolists = useAppSelector<TodolistDomainTypeApi[]>(state => state.todolists);
  //let tasks = useSelector(tasksSelector);

  //let tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
  //такая запись без использования слоя selectors

  return (
    <>
      {todolists.map(t => (
        <Paper
          key={t.id}
          sx={{
            p: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
          elevation={8}
        >
          <TodolistRedax todolists={t} demo={demo} />
        </Paper>
      ))}
    </>
  );
})
