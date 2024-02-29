import React, { useCallback, useState } from 'react'
import '../apps/App.css'
import { AddItemForm } from '../components/AddItemForm/AddItemForm'
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { lightGreen, lime } from '@mui/material/colors'
import MenuIcon from '@mui/icons-material/Menu'
import { ButtonMemo } from '../components/ButtonMemo'
import { TaskTypeApi } from '../api/tasks-api'
import { useAppDispatch } from '../state/hooks/hooks-selectors'
import { TodoListsForRender } from '../components/TodolistRender/TodolistRender'
import { addTodolistTC } from '../state/reducers/todolists/todolistsSlice'

export type TasksStateType = {
  [todoListId: string]: TaskTypeApi[]
}

export type AppReduxProps = {
  demo?: boolean
}

export const AppRedux: React.FC<AppReduxProps> = ({ demo = false }) => {
  console.log('AppRedux')
  const dispatch = useAppDispatch()

  const addTodoList = useCallback(
    (title: string) => {
      if (demo) return
      dispatch(addTodolistTC(title))
    },
    [dispatch]
  ) // пишем в зависимости то, что влияет на изменение todolista(обычно props)
  //  - видно в теле функции

  //менять тему сайта
  let [lightMode, setLightMode] = useState<boolean>(true)
  let btnText = lightMode ? 'dark' : 'light'
  const themeHandler = createTheme({
    palette: {
      primary: lightGreen,
      secondary: lime,
      mode: lightMode ? 'light' : 'dark',
    },
  })

  const toggleTheme = useCallback(() => {
    setLightMode(!lightMode)
  }, [lightMode])

  // <CssBaseline /> - обеспечивает максимальное применение стилей из библиотеки

  return (
    <ThemeProvider theme={themeHandler}>
      <CssBaseline />
      <div className="App">
        <AppBar position="static">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <IconButton edge="start" color={'inherit'} aria-label="menu">
              <MenuIcon fontSize="large" />
            </IconButton>
            <Typography variant="h6">TodoList</Typography>
            <Box>
              <ButtonMemo
                variant="outlined"
                size="small"
                color={'inherit'}
                onClick={toggleTheme}
                sx={{ mr: '10px' }}>
                {btnText}
              </ButtonMemo>
              {/* <ButtonMemo variant="outlined" size="small" color={"secondary"}>
                LogOut
              </ButtonMemo> */}
            </Box>
          </Toolbar>
        </AppBar>
        <Container>
          <Grid container sx={{ p: '20px', justifyContent: 'center', alignItems: 'center' }}>
            <AddItemForm errorText={'Enter title'} addItem={addTodoList} />
          </Grid>
          <Grid
            container
            sx={{
              p: '10px',
              justifyContent: 'space-berween',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '40px',
              flexWrap: 'wrap',
            }}>
            <TodoListsForRender demo={demo} />
          </Grid>
        </Container>
      </div>
    </ThemeProvider>
  )
}

export default AppRedux
