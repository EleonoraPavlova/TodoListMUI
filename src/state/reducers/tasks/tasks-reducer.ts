import { AppRootStateType, AppThunk } from '../../store';
import { TasksStateType } from "../../../apps/App";
import { TaskPriorities, TaskStatuses, TaskTypeApi, UpdateTaskModelType, tasksApi } from "../../../api/tasks-api";
import { setStatusAppAC, setSuccessAppAC } from "../app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "../../../utils/error-utils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { addTodolistAC, clearTodoListAC, removeTodolistAC, setTodoListAC } from "../todolists/todolists-reducer";

//АЛГОРИТМ редьюсер- функция кот хранит логику изменения state => возвращает измененый state
//1. Исходный state
//2. Объект для выполения действия со state
//2.1 Какой тип действия хотим выполнить
//2.2 Данные необходимые для этого действия - action

// | addTodolistAction
// | setTodoListAction
// | removeTodolistAction
// | clearTodoListAction


export enum ResultCode { //enum  ONLY for reading, cannot be overwritten!!
  SUCCEEDED = 0,
  ERROR = 1,
  ERROR_CAPTCHA = 10
}

export type UpdateTaskModelTypeForAnyField = { //only for UpdateTaskTC
  title?: string
  description?: string
  completed?: boolean
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}

export const initialStateTasks: TasksStateType = {
  "todoListId1": [
    {
      description: "",
      title: "",
      completed: false,
      status: TaskStatuses.New,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      id: "",
      todoListId: "",
      order: 0,
      addedDate: ""
    }
  ],
  "todoListId2": [
    {
      description: "",
      title: "",
      completed: false,
      status: TaskStatuses.New,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      id: "",
      todoListId: "",
      order: 0,
      addedDate: ""
    }
  ]
}

const slice = createSlice({
  name: "tasks",
  initialState: initialStateTasks,
  reducers: {
    removeTaskAC(state, action: PayloadAction<{ todoListId: string, taskId: string }>) {
      const tasks = state[action.payload.todoListId]
      const index = tasks.findIndex(t => t.id === action.payload.taskId)
      if (index !== -1) tasks.splice(index, 1)
    },
    addTaskAC(state, action: PayloadAction<{ task: TaskTypeApi }>) {
      console.log(state[action.payload.task.todoListId])
      console.log(state[action.payload.task.id])
      state[action.payload.task.todoListId]?.unshift(action.payload.task)
    },
    changeTaskStatusAC(state, action: PayloadAction<{ todoListId: string, taskId: string, status: TaskStatuses }>) {
      const tasks = state[action.payload.todoListId]
      const index = tasks.findIndex(t => t.id === action.payload.taskId)
      if (index !== -1) tasks[index].status = action.payload.status
    },
    updateTaskAC(state, action: PayloadAction<{ todoListId: string, taskId: string, model: UpdateTaskModelTypeForAnyField }>) {
      const tasks = state[action.payload.todoListId]
      const index = tasks.findIndex(t => t.id === action.payload.taskId)
      if (index !== -1) tasks[index] = { ...tasks[index], ...action.payload.model }
    },
    setTaskskAC(state, action: PayloadAction<{ todoListId: string, tasks: TaskTypeApi[] }>) {
      state[action.payload.todoListId] = action.payload.tasks
    }
  },
  extraReducers: (builder) => { //для обработки чужих reducer, 
    //extraReducers НЕ СОЗДАЕТ actions creators, он использует с другой логикой редьюсер с таким же названием
    builder
      .addCase(addTodolistAC, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(removeTodolistAC, (state, action) => {
        delete state[action.payload.todoListId] //delete property from {}
      })
      .addCase(setTodoListAC, (state, action) => {
        delete state["todoListId1"]
        delete state["todoListId2"]
        action.payload.todoLists.map(tl => state[tl.id] = [])//создаем свойство на основе тех листов,
        //которые прилетели с сервера - пробегаемся по каждому листу и  находим свойство id к которому добавляем - пустой массив
      })
      .addCase(clearTodoListAC, (state, action) => {
        return {}
      })
  }
})

export const tasksReducer = slice.reducer
export const { removeTaskAC, addTaskAC, changeTaskStatusAC, updateTaskAC, setTaskskAC } = slice.actions


//thunks
export const SetTasksTC = (todoListId: string): AppThunk =>
  async dispatch => {
    dispatch(setStatusAppAC({ status: "loading" }))
    try {
      const res = await tasksApi.getTasks(todoListId)
      dispatch(setTaskskAC({ todoListId, tasks: res.data.items }))
      dispatch(setStatusAppAC({ status: "succeeded" }))
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }


export const RemoveTaskTC = (todoListId: string, taskId: string): AppThunk =>
  async dispatch => {
    //dispatch - функция, которая используется для отправки действий в хранилище Redux.
    dispatch(setStatusAppAC({ status: "loading" }))
    dispatch(changeTaskStatusAC({ todoListId, taskId, status: TaskStatuses.inProgress }))
    try {
      const res = await tasksApi.deleteTasks(todoListId, taskId)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(removeTaskAC({ todoListId, taskId }))
        dispatch(setSuccessAppAC({ success: "task was successfully removed" }))
        dispatch(setStatusAppAC({ status: "succeeded" }))
      }
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }


export const AddTaskTC = (title: string, todoListId: string): AppThunk =>
  async dispatch => {
    //Для чего нужна функция dispatch санке ? Чтобы изменять state
    dispatch(setStatusAppAC({ status: "loading" }))
    try {
      const res = await tasksApi.createTasks(todoListId, title)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        const task = res.data.data.item
        dispatch(addTaskAC({ task }))
        dispatch(setSuccessAppAC({ success: "task was successfully added" }))
        dispatch(setStatusAppAC({ status: "succeeded" }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }


//update any field
export const UpdateTaskTC = (todoListId: string, taskId: string, model: UpdateTaskModelTypeForAnyField): AppThunk =>
  async (dispatch, getState: () => AppRootStateType) => { //Для чего нужна функция dispatch санке? Чтобы изменять state
    const state = getState()
    const task = state.tasks[todoListId].find(t => t.id === taskId) //нашли нужную таску в state и меняю поля которые необходимо

    if (!task) return

    const apiModel: UpdateTaskModelType = {
      title: task.title,
      description: task.description,
      completed: task.completed,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      ...model //перезатираю теми совпадающими полями, которые приходят с UpdateTaskTC
    }
    dispatch(setStatusAppAC({ status: "loading" }))
    try {
      const res = await tasksApi.updateTasks(todoListId, taskId, apiModel)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(updateTaskAC({ todoListId, taskId, model: apiModel }))
        dispatch(setSuccessAppAC({ success: "task was successfully updated" }))
        dispatch(setStatusAppAC({ status: "succeeded" }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }

//export const ChangeTaskTitleTC = (todoListId: string, taskId: string, title: string) => {
// return (dispatch: Dispatch) => {
//   tasksApi.updateTasks(todoListId, taskId, title)
//     .then(res => {
//       const action = ChangeTaskTitleAC(todoListId, taskId, title)
//       dispatch(action)
//     })
// }
//}

// export const ChangeTaskStatusTC = (todoListId: string, taskId: string, status: TaskStatuses) => {
//   return (dispatch: Dispatch, getState: () => AppRootStateType) => { //Для чего нужна функция dispatch санке ? Чтобы изменять state
//     const state = getState()
//     const task = state.tasks[todoListId].find(t => t.id === taskId) //нашли нужную таску в state и меняю поля которые необходимо
//     if (!task) {
//       console.warn("Task was not found")
//       return
//     }
//     const model: UpdateTaskModelType = {
//       title: task.title,
//       description: task.description,
//       completed: task.completed,
//       status: status,
//       priority: task.priority,
//       startDate: task.startDate,
//       deadline: task.deadline,
//     }
//     tasksApi.updateTasks(todoListId, taskId, model)
//       .then(res => {
//         const action = ChangeTaskStatusAC(todoListId, taskId, status)
//         debugger
//         dispatch(action)
//       })
//   }
// }