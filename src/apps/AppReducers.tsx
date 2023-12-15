import React, { Reducer, useReducer, useState } from 'react';
import './App.css';
import { AddItemForm } from "../components/AddItemForm/AddItemForm";
import {
  AppBar, Box, Button, Container,
  CssBaseline, Grid, IconButton, Paper, Toolbar, Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { lightGreen, lime } from "@mui/material/colors";
import MenuIcon from '@mui/icons-material/Menu';
import { AddTaskAC, ChangeTaskStatusAC, ChangeTaskTitleAC, RemoveTaskAC, TasksActionType, tasksReducer } from "../state/reducers/tasks/tasks-reducer";
import { ActionTypeTodolist, AddTodolistAC, ChangeTodoListFilterAC, ChangeTodoListTitleAC, FilterValuesType, RemoveTodolistAC, TodolistDomainTypeApi, todolistReducer } from "../state/reducers/todolists/todolists-reducer";
import { TaskStatuses, TaskTypeApi } from "../api/tasks-api";
import { todolistInitialState } from "../state/initialState/todolistsInitialState";
import { tasksInitialState } from "../state/initialState/tasksInitialState";
import { Todolist } from "../pages/TodolistPage/Todolist";


export type TasksStateType = {
  [todoListId: string]: TaskTypeApi[]
}

//переделать на api/dispatch
function AppReducers() {
  let [todoLists, dispatchTodolists] = useReducer<Reducer<TodolistDomainTypeApi[], ActionTypeTodolist>>(todolistReducer, todolistInitialState);
  let [tasks, dispatchTasks] = useReducer<Reducer<TasksStateType, TasksActionType>>(tasksReducer, tasksInitialState)


  //for tasks - 4 функц
  function removeTask(todoListsId: string, id: string) {
    const action = RemoveTaskAC(todoListsId, id)
    dispatchTasks(action)
  }

  function addTask(todoListsId: string, title: string) {
    // const action = AddTaskAC(todoListsId, title)
    // dispatchTasks(action)
  }

  function changeStatus(todoListsId: string, taskId: string, status: TaskStatuses) {
    const action = ChangeTaskStatusAC(todoListsId, taskId, status)
    dispatchTasks(action)
  }

  function changeTaskTitle(todoListsId: string, id: string, title: string) {
    const action = ChangeTaskTitleAC(todoListsId, id, title)
    dispatchTasks(action)
  }

  //for lists - 4 функц
  function addTodoList(title: string) {
    // const action = AddTodolistAC(title)
    // dispatchTasks(action)
    // dispatchTodolists(action)
  }

  function changeTodoListFilter(todoListsId: string, title: string, filter: FilterValuesType) {
    const action = ChangeTodoListFilterAC(todoListsId, title, filter)
    dispatchTodolists(action)
  }

  function removeTodoList(todoListsId: string) {
    const action = RemoveTodolistAC(todoListsId)
    dispatchTasks(action)
    dispatchTodolists(action)
  }


  function changeTodoListTitle(todoListsId: string, title: string) {
    const action = ChangeTodoListTitleAC(todoListsId, title)
    dispatchTodolists(action)
  }

  const filterForTasks = (todoListsId: string, filter: FilterValuesType): TaskTypeApi[] => {
    let tasksListforId = tasks[todoListsId]
    if (filter === "active") {
      tasksListforId = tasks[todoListsId].filter(t => t.status === TaskStatuses.New);
    }
    if (filter === "completed") {
      tasksListforId = tasks[todoListsId].filter(t => t.status === TaskStatuses.Completed);
    }
    return tasksListforId
  }

  const todoListsForRender = () => {
    return todoLists.map(t => {
      const filterForTasksHandler = () => filterForTasks(t.id, t.filter)
      return (
        <Paper key={t.id} sx={{
          p: "15px", display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
        }} elevation={8} >
          < Todolist title={t.title}
            todoListsId={t.id}
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
        </Paper >
      )
    })
  }



  //менять тему сайта
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
      <div className="App">
        <AppBar position="static">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton edge="start" color={"inherit"} aria-label="menu">
              <MenuIcon fontSize="large" />
            </IconButton>
            <Typography variant="h6">TodoList</Typography>
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
        <Container >
          <Grid container sx={{ p: "20px", justifyContent: "center", alignItems: "center" }}>
            <AddItemForm errorText={"Enter title"} addItem={addTodoList} />
          </Grid>
          <Grid container sx={{ p: "10px", justifyContent: "space-berween", display: "flex", alignItems: "flex-start", gap: "40px", flexWrap: "wrap" }}>
            {todoListsForRender()}
          </Grid>
        </Container >
      </div >
    </ThemeProvider >
  )
}

export default AppReducers;
