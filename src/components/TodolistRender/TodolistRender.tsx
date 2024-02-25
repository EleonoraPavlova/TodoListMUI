import { Box, Grid, Paper } from "@mui/material"
import { TodolistRedax } from "../../pages/TodolistPage/TodolistRedax"
import { useAppDispatch, useAppSelector } from "../../state/hooks/hooks-selectors";
import { memo } from "react";
import { TodolistDomainTypeApi, addTodolistTC } from "../../state/reducers/todolists/todolists-reducer";
import { AddItemForm } from "../AddItemForm/AddItemForm";

export type TodoListsForRenderProps = {
  demo?: boolean
}

export const TodoListsForRender: React.FC<TodoListsForRenderProps> = memo(({ demo = false }) => {
  //useSelector дает доступ к state
  //записывать так! HE {tasks, todoLists} - cоздается новая копия
  let todolists = useAppSelector<TodolistDomainTypeApi[]>(state => state.todolists);
  console.log(todolists)
  //let tasks = useSelector(tasksSelector);

  //let tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
  //такая запись без использования слоя selectors
  const dispatch = useAppDispatch()

  const addTodoList = (title: string) => {
    dispatch(addTodolistTC(title))
  }

  return (
    <Box sx={{
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      gap: "26px"
    }}>
      <AddItemForm errorText={"Enter title"} addItem={addTodoList} />
      <Grid container sx={{ p: "20px", justifyContent: "space-evenly", alignItems: "flex-start", gap: "35px" }}>
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
      </Grid>
    </Box >
  )
})
