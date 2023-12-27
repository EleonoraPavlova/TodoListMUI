import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import {
  AppBar, Box, Button, CircularProgress, Container,
  CssBaseline, Grid, IconButton, Toolbar, Typography,
} from "@mui/material";
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import { lightGreen, lime } from "@mui/material/colors";
import MenuIcon from '@mui/icons-material/Menu';
import { TaskTypeApi } from "./../api/tasks-api"
import { FilterValuesType } from "../state/reducers/todolists/todolists-reducer";
import { useAppDispatch, useAppSelector } from "../state/hooks/hooks-selectors";
import { TodoListsForRender } from "../components/TodolistRender/TodolistRender";
import LinearProgress from '@mui/material/LinearProgress';
import { SnackbarComponent } from "../components/Snackbar/SnackbarComponent";
import { RequestStatusType, setInitializeAppTC } from "../state/reducers/app/app-reducer";
import { Navigate, Routes, useNavigate } from "react-router-dom";
import { Route } from "react-router-dom";
import { Login } from "../pages/Login/Login";
import { logOutTC } from "../state/reducers/auth/auth-reducers";


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
  let initialized = useAppSelector<boolean>(state => state.app.initialized)
  console.log("initialized", initialized)
  console.log("isLoggedIn", isLoggedIn)
  const navigate = useNavigate();
  const dispatch = useAppDispatch()

  useEffect(() => {
    // if (!demo) return
    dispatch(setInitializeAppTC())
  }, [dispatch])

  useEffect(() => {
    if (!isLoggedIn && initialized) {
      navigate('/login')
    } else {
      navigate('/')
    }
  }, [isLoggedIn, initialized])

  let [lightMode, setLightMode] = useState<boolean>(true) // change state theme
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

  const logOutHandler = useCallback(() => {
    dispatch(logOutTC())
  }, [isLoggedIn])

  // <CssBaseline /> - обеспечивает максимальное применение стилей из библиотеки

  const CustomCircularProgress = styled(CircularProgress)(({ theme }) => ({
    "& circle": {
      strokeWidth: 2,
      stroke: lime,
    },
  }));

  if (!initialized) { //loader во время проверки срока куки и настроек
    return (
      <Box
        sx={{ display: 'flex', alignItems: "center", justifyContent: 'center', height: '100vh' }}>
        <CustomCircularProgress />
      </Box>)
  }

  return (
    <ThemeProvider theme={themeHandler}>
      <CssBaseline />
      <SnackbarComponent />
      <Box>
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
              {isLoggedIn && <Button variant="outlined" size="small" color={"secondary"} onClick={logOutHandler} sx={{ color: "white" }}>
                Log Out
              </Button>}
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
              <Route path="/login" element={isLoggedIn && initialized ? <Navigate to="/" /> : <Login />} />
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