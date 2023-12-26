import React, { useEffect, useState } from 'react';
import './App.css';
import {
  AppBar, Box, Button, Container,
  CssBaseline, Grid, IconButton, Toolbar, Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { lightGreen, lime } from "@mui/material/colors";
import MenuIcon from '@mui/icons-material/Menu';
import { TaskTypeApi } from "./../api/tasks-api"
import { FilterValuesType, setTodoListTC } from "../state/reducers/todolists/todolists-reducer";
import { useAppDispatch, useAppSelector } from "../state/hooks/hooks-selectors";
import { TodoListsForRender } from "../components/TodolistRender/TodolistRender";
import LinearProgress from '@mui/material/LinearProgress';
import { SnackbarComponent } from "../components/Snackbar/SnackbarComponent";
import { RequestStatusType } from "../state/reducers/app/app-reducer";
import { Navigate, Routes, useNavigate } from "react-router-dom";
import { Route } from "react-router-dom";
import { Login } from "../pages/Login/Login";


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
  let isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)
  const navigate = useNavigate();
  const dispatch = useAppDispatch()

  useEffect(() => {
    // if (!demo) return
    if (isLoggedIn) navigate("/")
    dispatch(setTodoListTC())
  }, [dispatch, isLoggedIn])

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

  const logIn = () => {
    navigate("/login")
  }

  // <CssBaseline /> - обеспечивает максимальное применение стилей из библиотеки

  return (
    <ThemeProvider theme={themeHandler}>
      <CssBaseline />
      <SnackbarComponent />
      <Box>
        <AppBar position="static">
          {isLoggedIn}
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton edge="start" color={"default"} aria-label="menu">
              <MenuIcon fontSize="large" />
            </IconButton>
            <Typography variant="h6" color={"white"}>TodoList</Typography>
            <Box>
              <Button variant="outlined" size="small" color={"inherit"} onClick={toggleTheme} sx={{ mr: '10px' }}>
                {btnText}
              </Button>
              <Button variant="outlined" size="small" color={"secondary"} onClick={logIn}>
                {isLoggedIn ? "LogOut" : "LogIn"}
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        {status === "loading" && <LinearProgress />}
        {/* when status === "loading" show LinearProgress*/}
        <Container sx={{ marginTop: '25px' }}>
          <Grid container
            sx={{
              p: "10px", justifyContent: "center",
              display: "flex", alignItems: "center", gap: "40px",
              flexWrap: "wrap"
            }}>
            <Routes>
              <Route path="/" element={<TodoListsForRender demo={demo} />} />
              <Route path="/login" element={<Login />} />
              <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>} />
              <Route path='*' element={<Navigate to="/404" />} />
            </Routes>
          </Grid>
        </Container >
      </ Box>
    </ThemeProvider >
  )
}

export default App;