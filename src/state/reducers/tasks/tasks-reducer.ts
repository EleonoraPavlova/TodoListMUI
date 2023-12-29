import { AppRootStateType, AppThunk } from '../../store';
import { TasksStateType } from "../../../apps/App";
import { addTodolistAction, removeTodolistAction, getTodoListAction, clearTodoListAction } from "../todolists/todolists-reducer";
import { TaskPriorities, TaskStatuses, TaskTypeApi, UpdateTaskModelType, tasksApi } from "../../../api/tasks-api";
import { setStatusAppAC, setSuccessAppAC } from "../app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "../../../utils/error-utils";

//АЛГОРИТМ редьюсер- функция кот хранит логику изменения state => возвращает измененый state
//1. Исходный state
//2. Объект для выполения действия со state
//2.1 Какой тип действия хотим выполнить
//2.2 Данные необходимые для этого действия - action


//пишем что нам нужно для выполения action, какие именно данные
export type TasksActionType =
  ReturnType<typeof RemoveTaskAC>
  | ReturnType<typeof AddTaskAC>
  | ReturnType<typeof ChangeTaskTitleAC>
  | ReturnType<typeof ChangeTaskStatusAC>
  | ReturnType<typeof SetTaskskAC>
  | ReturnType<typeof UpdateTaskAC>
  | addTodolistAction
  | getTodoListAction
  | removeTodolistAction
  | clearTodoListAction


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

export const tasksReducer = (state: TasksStateType = initialStateTasks, action: TasksActionType): TasksStateType => {
  switch (action.type) {
    case "REMOVE-TASK":
      return { ...state, [action.todoListsId]: state[action.todoListsId].filter(t => t.id !== action.id) };
    case "ADD-TASK":
      let copyState = { ...state }
      let tasks = copyState[action.task.todoListId]
      if (tasks) {
        const newTasks = [action.task, ...tasks]
        copyState[action.task.todoListId] = newTasks
        return copyState
      }
      return copyState
    case "CHANGE-TASK-TITLE":
      return { ...state, [action.todoListsId]: state[action.todoListsId]?.map(t => t.id === action.taskId ? { ...t, title: action.title } : t) }
    case "CHANGE-TASK-STATUS": {
      const copyState = { ...state }
      const tasks = copyState[action.todoListsId]
      if (tasks) {
        return { ...copyState, [action.todoListsId]: tasks.map(t => t.id === action.taskId ? { ...t, status: action.status } : t) }
      }
      return copyState
    }
    case "UPDATE-TASK":
      return { ...state, [action.todoListsId]: state[action.todoListsId].map((t) => t.id === action.taskId ? { ...t, ...action.model } : t) }
    case "ADD-TODOLIST":
      return { [action.todolist.id]: [], ...state }
    case "REMOVE-TODOLIST": {
      let copyState = { ...state }
      delete copyState[action.todoListsId] //delete property from {}
      return copyState
    }
    case "SET-TODOLIST": {
      const copyState = { ...state }
      action.todoLists.map(tl => copyState[tl.id] = [])//создаем свойство на основе тех листов,
      //которые прилетели с сервера - пробегаемся по каждому листу и  находим свойство id к которому добавляем - пустой массив
      return copyState
    }
    case "SET-TASKS": {
      return { ...state, [action.todoListsId]: action.tasks }//скопировала стейт,
      // нашла нужный todolist по приходящему action и установила tasks, которые прилетели с сервера
    }
    case "CLEAR-TODOLISTS":
      return {}
    default: return state
  }
}

//функц action creator
export const RemoveTaskAC = (todoListsId: string, id: string) => {
  return {
    type: "REMOVE-TASK", todoListsId, id
  } as const //для явного указания типа литерала на основе конкретного значения 
}

export const AddTaskAC = (task: TaskTypeApi) => ({ type: "ADD-TASK", task } as const)


export const ChangeTaskStatusAC = (todoListsId: string, taskId: string, status: TaskStatuses) => {
  return {
    type: "CHANGE-TASK-STATUS",
    todoListsId, taskId, status
  } as const
}

export const ChangeTaskTitleAC = (todoListsId: string, taskId: string, title: string) => {
  return {
    type: "CHANGE-TASK-TITLE",
    todoListsId, taskId, title
  } as const
}

export const UpdateTaskAC = (todoListsId: string, taskId: string, model: UpdateTaskModelTypeForAnyField) => {
  return {
    type: "UPDATE-TASK",
    todoListsId, taskId, model
  } as const
}

export const SetTaskskAC = (todoListsId: string, tasks: TaskTypeApi[]) => {
  return {
    type: "SET-TASKS",
    todoListsId, tasks
  } as const
}


//thunks
export const SetTasksTC = (todoListsId: string): AppThunk =>
  async dispatch => {
    dispatch(setStatusAppAC("loading"))
    try {
      const res = await tasksApi.getTasks(todoListsId)
      dispatch(SetTaskskAC(todoListsId, res.data.items))
      dispatch(setStatusAppAC("succeeded"))
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }


export const RemoveTaskTC = (todoListsId: string, taskId: string): AppThunk =>
  async dispatch => {
    //dispatch - функция, которая используется для отправки действий в хранилище Redux.
    dispatch(setStatusAppAC("loading"))
    dispatch(ChangeTaskStatusAC(todoListsId, taskId, TaskStatuses.inProgress))
    try {
      const res = await tasksApi.deleteTasks(todoListsId, taskId)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(RemoveTaskAC(todoListsId, taskId))
        dispatch(setSuccessAppAC("task was successfully removed"))
        dispatch(setStatusAppAC("succeeded"))
      }
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }


export const AddTaskTC = (title: string, todoListsId: string): AppThunk =>
  async dispatch => {
    //Для чего нужна функция dispatch санке ? Чтобы изменять state
    dispatch(setStatusAppAC("loading"))
    try {
      const res = await tasksApi.createTasks(todoListsId, title)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        const task = res.data.data.item
        dispatch(AddTaskAC(task))
        dispatch(setSuccessAppAC("task was successfully added"))
        dispatch(setStatusAppAC("succeeded"))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }


//update any field
export const UpdateTaskTC = (todoListsId: string, taskId: string, model: UpdateTaskModelTypeForAnyField): AppThunk =>
  async (dispatch, getState: () => AppRootStateType) => { //Для чего нужна функция dispatch санке? Чтобы изменять state
    const state = getState()
    const task = state.tasks[todoListsId].find(t => t.id === taskId) //нашли нужную таску в state и меняю поля которые необходимо

    if (!task) return

    const apiModel: UpdateTaskModelType = {
      title: task.title,
      description: task.description,
      completed: task.completed,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      ...model //перезатираю теми соападающими полями, которые приходят с UpdateTaskTC
    }
    dispatch(setStatusAppAC("loading"))
    try {
      const res = await tasksApi.updateTasks(todoListsId, taskId, apiModel)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(UpdateTaskAC(todoListsId, taskId, apiModel))
        dispatch(setSuccessAppAC("task was successfully updated"))
        dispatch(setStatusAppAC("succeeded"))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }

//export const ChangeTaskTitleTC = (todoListsId: string, taskId: string, title: string) => {
// return (dispatch: Dispatch) => {
//   tasksApi.updateTasks(todoListsId, taskId, title)
//     .then(res => {
//       const action = ChangeTaskTitleAC(todoListsId, taskId, title)
//       dispatch(action)
//     })
// }
//}

// export const ChangeTaskStatusTC = (todoListsId: string, taskId: string, status: TaskStatuses) => {
//   return (dispatch: Dispatch, getState: () => AppRootStateType) => { //Для чего нужна функция dispatch санке ? Чтобы изменять state
//     const state = getState()
//     const task = state.tasks[todoListsId].find(t => t.id === taskId) //нашли нужную таску в state и меняю поля которые необходимо
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
//     tasksApi.updateTasks(todoListsId, taskId, model)
//       .then(res => {
//         const action = ChangeTaskStatusAC(todoListsId, taskId, status)
//         debugger
//         dispatch(action)
//       })
//   }
// }