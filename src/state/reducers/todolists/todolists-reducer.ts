import { TodolistTypeApi, todolistApi } from "../../../api/todolist-api";
import { RequestStatusType, setStatusAppAC, setSuccessAppAC } from "../app/app-reducer";
import { AppThunk } from "../../store";
import { handleServerAppError, handleServerNetworkError } from "../../../utils/error-utils";
import { ResultCode } from "../tasks/tasks-reducer";


//АЛГОРИТМ
//1. Исходный state
//2. Объект для выполения действия со state
//2.1 Какой тип действия хотим выполнить
//2.2 Данные необходимые для этого действия - action

export type setTodoListACtion = ReturnType<typeof setTodoListAC>
export type addTodolistACtion = ReturnType<typeof addTodolistAC>
export type removeTodolistACtion = ReturnType<typeof removeTodolistAC>
export type changeTodolistEntityStatusACtion = ReturnType<typeof changeTodolistEntityStatusAC>

//пишем что нам нужно для выполения action, какие именно данные
export type ActionTypeTodolist =
  | ReturnType<typeof changeTodoListTitleAC>
  | ReturnType<typeof changeTodoListFilterAC>
  | setTodoListACtion
  | addTodolistACtion
  | removeTodolistACtion
  | changeTodolistEntityStatusACtion


export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainTypeApi = TodolistTypeApi & { //расширяю тип который приходить с backend
  filter: FilterValuesType,
  entityStatus: RequestStatusType
}

export const todolistReducer = (state: TodolistDomainTypeApi[] = [], action: ActionTypeTodolist): TodolistDomainTypeApi[] => {
  switch (action.type) {
    case "REMOVE-TODOLIST":
      return state.filter(l => l.id !== action.todoListsId);
    case "ADD-TODOLIST":
      //cкопировала пришедший todolist и добавила недостающий filter
      return [{ ...action.todolist, filter: "all", entityStatus: "idle" }, ...state]; //работает как  setTodoLists([newTodoId, ...todoLists])
    case "CNAHGE-TODOLIST-TITLE":
      return state.map(t => t.id === action.todoListsId ? { ...t, title: action.title } : t)
    case "CNAHGE-TODOLIST-FILTER":
      return state.map(t => t.id === action.todoListsId ? { ...t, filter: action.filter } : t)
    case "SET-TODOLIST": //установка todolistis, только пришедших с сервера и установка их в изначально пустой массив
      return action.todoLists.map(tl => ({ ...tl, filter: "all", entityStatus: "idle" })) //добавила каждому листу недостающий фильтр
    case "CNAHGE-TODOLIST-ENTITY-STATUS":
      return state.map(t => t.id === action.todoListsId ? { ...t, entityStatus: action.entityStatus } : t)
    default: return state
  }
}

//action creator
export const removeTodolistAC = (todoListsId: string) => {
  return {
    type: "REMOVE-TODOLIST", todoListsId
  } as const
}

export const addTodolistAC = (todolist: TodolistTypeApi) => ({ type: "ADD-TODOLIST", todolist } as const)


export const changeTodoListTitleAC = (todoListsId: string, title: string) => {
  return {
    type: "CNAHGE-TODOLIST-TITLE", title, todoListsId
  } as const
}

export const changeTodoListFilterAC = (todoListsId: string, title: string, filter: FilterValuesType) => {
  return {
    type: "CNAHGE-TODOLIST-FILTER",
    todoListsId, title, filter
  } as const
}

export const changeTodolistEntityStatusAC = (todoListsId: string, entityStatus: RequestStatusType) => {
  return { type: "CNAHGE-TODOLIST-ENTITY-STATUS", todoListsId, entityStatus } as const
}

export const setTodoListAC = (todoLists: TodolistTypeApi[]) => { //установить todolist, который пришел с сервера
  return {
    type: "SET-TODOLIST", todoLists
  } as const
}

//thunks
export const SetTodoListTC = (): AppThunk =>
  async dispatch => {
    dispatch(setStatusAppAC("loading"))
    try {
      const res = await todolistApi.getTodo()
      dispatch(setTodoListAC(res.data))
      dispatch(setStatusAppAC("succeeded"))
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }

export const RemoveTodolistTC = (todoListsId: string): AppThunk =>
  async dispatch => {
    dispatch(setStatusAppAC("loading"))
    dispatch(changeTodolistEntityStatusAC(todoListsId, "loading"))//loader appeared
    try {
      const res = await todolistApi.deleteTodo(todoListsId)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(removeTodolistAC(todoListsId))
        dispatch(setSuccessAppAC("todolist was successfully removed"))
        dispatch(setStatusAppAC("succeeded"))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }


export const AddTodolistTC = (title: string): AppThunk =>
  async dispatch => {
    dispatch(setStatusAppAC("loading"))
    try {
      const res = await todolistApi.createTodo(title)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(addTodolistAC(res.data.data.item))
        dispatch(setSuccessAppAC("todolist was successfully added"))
        dispatch(setStatusAppAC("succeeded"))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }


export const ChangeTodoListTitleTC = (todolistId: string, title: string): AppThunk =>
  async dispatch => {
    dispatch(setStatusAppAC("loading"))
    try {
      const res = await todolistApi.updateTodo(todolistId, title)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(changeTodoListTitleAC(todolistId, title))
        dispatch(setSuccessAppAC("todolist title was successfully updated"))
        dispatch(setStatusAppAC("succeeded"))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }


export const ChangeTodoListFilterTC = (todolistId: string, title: string, filter: FilterValuesType): AppThunk =>
  async dispatch => {
    dispatch(setStatusAppAC("loading"))
    try {
      const res = await todolistApi.updateTodo(todolistId, title)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(changeTodoListFilterAC(todolistId, title, filter))
        dispatch(setStatusAppAC("succeeded"))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }