import React, { Reducer, useReducer, useState } from 'react'
import './App.css'
import { AddItemForm } from '../components/AddItemForm/AddItemForm'
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { lightGreen, lime } from '@mui/material/colors'
import MenuIcon from '@mui/icons-material/Menu'
import { tasksReducer } from '../state/reducers/tasks/tasks-reducer'
import {
  FilterValuesType,
  TodolistDomainTypeApi,
  todolistReducer,
} from '../state/reducers/todolists/todolists-reducer'
import { TaskStatuses, TaskTypeApi } from '../api/tasks-api'
import { todolistInitialState } from '../state/initialState/todolistsInitialState'
import { tasksInitialState } from '../state/initialState/tasksInitialState'
import { Todolist } from '../pages/TodolistPage/Todolist'

export type TasksStateType = {
  [todoListId: string]: TaskTypeApi[]
}

//переделать на api/dispatch
function AppReducers() {
  let [todoLists, dispatchTodolists] = useReducer<Reducer<TodolistDomainTypeApi[], any>>(
    todolistReducer,
    todolistInitialState
  )
  let [tasks, dispatchTasks] = useReducer<Reducer<TasksStateType, any>>(
    tasksReducer,
    tasksInitialState
  )

  //for tasks - 4 функц
  function removeTask(todoListId: string, id: string) {
    // const action = removeTaskAC({ todoListId, taskId: id })
    // dispatchTasks(action)
  }

  function addTask(todoListId: string, title: string) {
    // const action = AddTaskAC(todoListId, title)
    // dispatchTasks(action)
  }

  function changeStatus(todoListId: string, taskId: string, status: TaskStatuses) {
    // const action = changeTaskStatusAC({ todoListId, taskId, status })
    // dispatchTasks(action)
  }

  function changeTaskTitle(todoListId: string, taskId: string, title: string) {
    // const action = updateTaskAC({ todoListId, taskId, tasks.title })
    // dispatchTasks(action)
  }

  //for lists - 4 функц
  function addTodoList(title: string) {
    // const action = addTodolistAC(title)
    // dispatchTasks(action)
    // dispatchTodolists(action)
  }

  function changeTodoListFilter(todoListId: string, title: string, filter: FilterValuesType) {
    // const action = updateTodolistAC({ params: { todoListId, title, filter } })
    // dispatchTodolists(action)
  }

  function removeTodoList(todoListId: string) {
    // const action = removeTodolistAC({ todoListId })
    // dispatchTasks(action)
    // dispatchTodolists(action)
  }

  function changeTodoListTitle(todoListId: string, title: string) {
    // const action = updateTodolistAC({ params: { todoListId, title, todoLists.filter } })
    // dispatchTodolists(action)
  }

  const filterForTasks = (todoListId: string, filter: FilterValuesType): TaskTypeApi[] => {
    let tasksListforId = tasks[todoListId]
    if (filter === 'active') {
      tasksListforId = tasks[todoListId].filter(t => t.status === TaskStatuses.New)
    }
    if (filter === 'completed') {
      tasksListforId = tasks[todoListId].filter(t => t.status === TaskStatuses.Completed)
    }
    return tasksListforId
  }

  const todoListsForRender = () => {
    return todoLists.map(t => {
      const filterForTasksHandler = () => filterForTasks(t.id, t.filter)
      return (
        <Paper
          key={t.id}
          sx={{
            p: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
          elevation={8}>
          <Todolist
            title={t.title}
            todoListId={t.id}
            tasks={filterForTasksHandler()}
            removeTask={removeTask}
            changeTodoListFilter={changeTodoListFilter}
            addTask={addTask}
            changeTaskStatus={changeStatus}
            filter={t.filter}
            removeTodoList={removeTodoList}
            changeTaskTitle={changeTaskTitle}
            changeTodolistTitle={changeTodoListTitle}
          />
        </Paper>
      )
    })
  }

  //менять тему сайта
  let [lightMode, setLightMode] = useState<boolean>(true) // для изменения темы стейт
  let btnText = lightMode ? 'dark' : 'light'
  const themeHandler = createTheme({
    palette: {
      primary: lightGreen,
      secondary: lime,
      mode: lightMode ? 'light' : 'dark',
    },
  })

  const toggleTheme = () => {
    setLightMode(!lightMode)
  }

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
              <Button
                variant="outlined"
                size="small"
                color={'inherit'}
                onClick={toggleTheme}
                sx={{ mr: '10px' }}>
                {btnText}
              </Button>
              <Button variant="outlined" size="small" color={'secondary'}>
                LogOut
              </Button>
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
            {todoListsForRender()}
          </Grid>
        </Container>
      </div>
    </ThemeProvider>
  )
}

export default AppReducers
