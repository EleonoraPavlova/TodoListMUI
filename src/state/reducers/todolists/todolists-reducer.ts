import { TodolistTypeApi, todolistApi } from "../../../api/todolist-api";
import { RequestStatusType, setStatusAppAC, setSuccessAppAC } from "../app/app-reducer";
import { AppThunk } from "../../store";
import { handleServerAppError, handleServerNetworkError } from "../../../utils/error-utils";
import { ResultCode, SetTasksTC } from "../tasks/tasks-reducer";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

//АЛГОРИТМ
//1. Исходный state
//2. Объект для выполения действия со state
//2.1 Какой тип действия хотим выполнить
//2.2 Данные необходимые для этого действия - action

export type FilterValuesType = "all" | "active" | "completed"

export type TodolistDomainTypeApi = TodolistTypeApi & { //расширяю тип который приходить с backend
  filter: FilterValuesType,
  entityStatus: RequestStatusType
}
export type UpdateTodolistPayload = {
  todoListId: string;
  title: string;
  filter: FilterValuesType;
};

const initialState: TodolistDomainTypeApi[] = []

const slice = createSlice({
  name: "todolist",
  initialState: initialState,
  reducers: {
    removeTodolistAC(state, action: PayloadAction<{ todoListId: string }>) {
      const index = state.findIndex(t => t.id === action.payload.todoListId)
      if (index !== - 1) state.splice(index, 1)
    },
    addTodolistAC(state, action: PayloadAction<{ todolist: TodolistTypeApi }>) {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
    },
    updateTodolistAC(state, action: PayloadAction<{ params: UpdateTodolistPayload }>) {
      const index = state.findIndex(t => t.id === action.payload.params.todoListId)
      if (index !== - 1) state[index] = { ...state[index], ...action.payload.params }
      //объединить существующий элементы массива со значениями из action.payload.params
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ todoListId: string, entityStatus: RequestStatusType }>) {
      const index = state.findIndex(t => t.id === action.payload.todoListId)
      if (index !== - 1) state[index].entityStatus = action.payload.entityStatus
    },
    setTodoListAC(state, action: PayloadAction<{ todoLists: TodolistTypeApi[] }>) {
      return action.payload.todoLists.map(tl => ({ ...tl, filter: "all", entityStatus: "idle" }))
    },
    clearTodoListAC() {
      return []
    }
  }
})

export const todolistReducer = slice.reducer
export const { removeTodolistAC, addTodolistAC,
  updateTodolistAC, changeTodolistEntityStatusAC, setTodoListAC,
  clearTodoListAC } = slice.actions

// export const changeTodoListFilterAC = (todoListId: string, title: string, filter: FilterValuesType) => {
//   return {
//     type: "CNAHGE-TODOLIST-FILTER",
//     todoListId, title, filter
//   } as const
// }

// export const changeTodolistEntityStatusAC = (todoListId: string, entityStatus: RequestStatusType) => {
//   return { type: "CNAHGE-TODOLIST-ENTITY-STATUS", todoListId, entityStatus } as const
// }

// export const getTodoListAC = (todoLists: TodolistTypeApi[]) => { //установить todolist, который пришел с сервера
//   return {
//     type: "SET-TODOLIST", todoLists
//   } as const
// }

// export const clearTodoListAC = () => { //убрать все todolists, после вылогинивания
//   return {
//     type: "CLEAR-TODOLISTS",
//   } as const
// }

//thunks
export const SetTodoListTC = (): AppThunk =>
  async dispatch => {
    dispatch(setStatusAppAC({ status: "loading" }))
    try {
      const res = await todolistApi.getTodos()
      dispatch(setTodoListAC({ todoLists: res.data }))
      dispatch(setStatusAppAC({ status: "succeeded" }))
      res.data.map(tl => {
        dispatch(SetTasksTC(tl.id))
      })
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }

export const RemoveTodolistTC = (todoListId: string): AppThunk =>
  async dispatch => {
    dispatch(setStatusAppAC({ status: "loading" }))
    dispatch(changeTodolistEntityStatusAC({ todoListId, entityStatus: "loading" }))//loader appeared
    try {
      const res = await todolistApi.deleteTodo(todoListId)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(removeTodolistAC({ todoListId }))
        dispatch(setSuccessAppAC({ success: "todolist was successfully removed" }))
        dispatch(setStatusAppAC({ status: "succeeded" }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }


export const AddTodolistTC = (title: string): AppThunk =>
  async dispatch => {
    dispatch(setStatusAppAC({ status: "loading" }))
    try {
      const res = await todolistApi.createTodo(title)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(addTodolistAC({ todolist: res.data.data.item }))
        dispatch(setSuccessAppAC({ success: "todolist was successfully added" }))
        dispatch(setStatusAppAC({ status: "succeeded" }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }


export const ChangeTodoListTitleTC = (params: UpdateTodolistPayload): AppThunk =>
  async dispatch => {
    dispatch(setStatusAppAC({ status: "loading" }))
    try {
      const res = await todolistApi.updateTodo(params.todoListId, params.title)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(updateTodolistAC({ params }))
        dispatch(setSuccessAppAC({ success: "todolist title was successfully updated" }))
        dispatch(setStatusAppAC({ status: "succeeded" }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }


export const ChangeTodoListFilterTC = (params: UpdateTodolistPayload): AppThunk =>
  async dispatch => {
    dispatch(setStatusAppAC({ status: "loading" }))
    try {
      const res = await todolistApi.updateTodo(params.todoListId, params.title)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(updateTodolistAC({ params }))
        dispatch(setStatusAppAC({ status: "succeeded" }))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }