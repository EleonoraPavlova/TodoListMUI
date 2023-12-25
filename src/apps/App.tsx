import React, { useEffect, useState } from 'react';
import './App.css';
import { AddItemForm } from "../components/AddItemForm/AddItemForm";
import {
  AppBar, Box, Button, Container,
  CssBaseline, Grid, IconButton, Toolbar, Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { lightGreen, lime } from "@mui/material/colors";
import MenuIcon from '@mui/icons-material/Menu';
import { TaskTypeApi } from "./../api/tasks-api"
import { AddTodolistTC, FilterValuesType, SetTodoListTC } from "../state/reducers/todolists/todolists-reducer";
import { useAppDispatch, useAppSelector } from "../state/hooks/hooks-selectors";
import { TodoListsForRender } from "../components/TodolistRender/TodolistRender";
import LinearProgress from '@mui/material/LinearProgress';
import { SnackbarComponent } from "../components/Snackbar/SnackbarComponent";
import { RequestStatusType } from "../state/reducers/app-reducer/app-reducer";


export type TodolistType = {
  id: string
  title: string
  filter: FilterValuesType
}

export type TasksStateType = {
  [todoListId: string]: TaskTypeApi[]
}

export type AppProps = {
  demo?: boolean
}

export const App: React.FC<AppProps> = ({ demo = false }) => {
  let status = useAppSelector<RequestStatusType>(state => state.app.status)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!demo) return
    dispatch(SetTodoListTC())
  }, [dispatch, demo])

  function addTodoList(title: string) {
    dispatch(AddTodolistTC(title))
  }

  let [lightMode, setLightMode] = useState<boolean>(true) // для изменения темы стейт
  let btnText = lightMode ? "dark" : "light"
  const themeHandler = createTheme({
    palette: {
      primary: lightGreen,
      secondary: lime,
      mode: lightMode ? "light" : "dark",
    }
  })

  const toggleTheme = () => {
    setLightMode(!lightMode)
  }

  // <CssBaseline /> - обеспечивает максимальное применение стилей из библиотеки

  return (
    <ThemeProvider theme={themeHandler}>
      <CssBaseline />
      <SnackbarComponent />
      <div className="App">
        <AppBar position="static">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton edge="start" color={"default"} aria-label="menu">
              <MenuIcon fontSize="large" />
            </IconButton>
            <Typography variant="h6" color={"white"}>TodoList</Typography>
            <Box>
              <Button variant="outlined" size="small" color={"inherit"} onClick={toggleTheme} sx={{ mr: '10px' }}>
                {btnText}
              </Button>
              <Button variant="outlined" size="small" color={"secondary"}>
                LogOut
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        {status === "loading" && <LinearProgress />}
        {/* when status === "loading" show LinearProgress*/}
        <Container >
          <Grid container sx={{ p: "20px", justifyContent: "center", alignItems: "center" }}>
            <AddItemForm errorText={"Enter title"} addItem={addTodoList} />
          </Grid>
          <Grid container sx={{ p: "10px", justifyContent: "space-berween", display: "flex", alignItems: "flex-start", gap: "40px", flexWrap: "wrap" }}>
            <TodoListsForRender demo={demo} />
          </Grid>
        </Container >
      </div >
    </ThemeProvider >
  )
}

export default App;
