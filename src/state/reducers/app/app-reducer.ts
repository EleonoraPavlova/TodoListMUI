import { authApi } from "../../../api/auth-api"
import { handleServerAppError, handleServerNetworkError } from "../../../utils/error-utils"
import { AppThunk } from "../../store"
import { setIsLoggedInAC } from "../auth/auth-reducers"
import { ResultCode } from "../tasks/tasks-reducer"
import { setTodoListTC } from "../todolists/todolists-reducer"

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed' //статус взаимодействия с сервером

export type InitialStateType = {
  status: RequestStatusType,
  error: string | null, //текст приходящей ошибки
  success: string | null,
  initialized: boolean
}

export type SetErrorApp = ReturnType<typeof setErrorAppAC>
export type SetStatusApp = ReturnType<typeof setStatusAppAC>
export type setSuccessApp = ReturnType<typeof setSuccessAppAC>
export type setInitializeApp = ReturnType<typeof setInitializeAppAC>

export type ActionType = SetErrorApp | SetStatusApp | setSuccessApp | setInitializeApp

export let InitialStateApp: InitialStateType = {
  status: 'idle', //'idle'  - еще запроса не было - for loader App, меняется при каждом запросе на сервер!
  error: null, //нет никакой ошибки изначально //меняется при каждом запросе на сервер!
  success: null,
  initialized: false //(проверка куки, настроек пользователя)
}

export const appReducer = (state: InitialStateType = InitialStateApp, action: ActionType): InitialStateType => {
  switch (action.type) {
    case "SET-APP-ERROR":
      return { ...state, error: action.error }
    case "SET-APP-STATUS":
      return { ...state, status: action.status }
    case "SET-APP-SUCCESS":
      return { ...state, success: action.success }
    case "SET-APP-INITIALIZE":
      return { ...state, initialized: action.initialized }
    default: return { ...state }
  }
}

//action creator
export const setErrorAppAC = (error: string | null) => {
  return { type: "SET-APP-ERROR", error } as const
}

export const setStatusAppAC = (status: RequestStatusType) => {
  return { type: "SET-APP-STATUS", status } as const
}
export const setSuccessAppAC = (success: string | null) => {
  return { type: "SET-APP-SUCCESS", success } as const
}

export const setInitializeAppAC = (initialized: boolean) => {
  return { type: "SET-APP-INITIALIZE", initialized } as const
}

//thunks
export const setInitializeAppTC = (): AppThunk =>
  async dispatch => {
    dispatch(setStatusAppAC("loading"))
    try {
      const res = await authApi.authMe()
      // анонимный пользователь или авториз
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(setStatusAppAC("succeeded"))
        dispatch(setIsLoggedInAC(true))
        dispatch(setTodoListTC())
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (err) {
      handleServerNetworkError({ message: err instanceof Error ? err.message : String(err) }, dispatch);
    } finally {
      dispatch(setInitializeAppAC(true))
    }
  }