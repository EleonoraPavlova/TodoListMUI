import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { authApi } from "../../../api/auth-api"
import { handleServerAppError, handleServerNetworkError } from "../../../utils/error-utils"
import { AppThunk } from "../../store"
import { ResultCode } from "../tasks/tasks-reducer"
import { SetTodoListTC } from "../todolists/todolists-reducer"
import { setIsLoggedInAC } from "../auth/auth-reducers"

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed' //статус взаимодействия с сервером

export type InitialStateType = {
  status: RequestStatusType,
  error: string | null, //текст приходящей ошибки
  success: string | null,
  initialized: boolean
}


export let InitialStateApp: InitialStateType = {
  status: 'idle', //'idle'  - еще запроса не было - for loader App, меняется при каждом запросе на сервер!
  error: null, //нет никакой ошибки изначально //меняется при каждом запросе на сервер!
  success: null,
  initialized: false //(проверка куки, настроек пользователя)
}

const slice = createSlice({
  name: "app",
  initialState: InitialStateApp,
  reducers: {
    setInitializeAppAC(state, action: PayloadAction<{ initialized: boolean }>) {
      state.initialized = action.payload.initialized
    },
    setErrorAppAC(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error
    },
    setStatusAppAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status
    },
    setSuccessAppAC(state, action: PayloadAction<{ success: string | null }>) {
      state.success = action.payload.success
    }
  }
})


export const appReducer = slice.reducer
export const { setInitializeAppAC, setErrorAppAC, setStatusAppAC, setSuccessAppAC } = slice.actions

//thunks
export const setInitializeAppTC = (): AppThunk =>
  async dispatch => {
    dispatch(setStatusAppAC({ status: "loading" }))
    try {
      const res = await authApi.authMe()
      // анонимный пользователь или авториз
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(setIsLoggedInAC({ isLoggedIn: true }))
        dispatch(setStatusAppAC({ status: "succeeded" }))
        dispatch(SetTodoListTC())
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch);
    } finally {
      dispatch(setInitializeAppAC({ initialized: true }))
    }
  }