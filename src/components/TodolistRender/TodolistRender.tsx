import { Paper } from "@mui/material"
import { TodolistRedax } from "../../pages/TodolistPage/TodolistRedax"
import { useAppSelector } from "../../state/hooks/hooks-selectors";
import { todolistsSelector } from "../../state/selectors";
import { memo } from "react";

export type TodoListsForRenderProps = {
  demo?: boolean
}

export const TodoListsForRender: React.FC<TodoListsForRenderProps> = memo(({ demo = false }) => {
  //useSelector дает доступ к state
  //записывать так! HE {tasks, todoLists} - cоздается новая копия
  let todolists = useAppSelector(todolistsSelector);
  //let tasks = useSelector(tasksSelector);

  //let tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
  //такая запись без испоьзования слоя selectors

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
