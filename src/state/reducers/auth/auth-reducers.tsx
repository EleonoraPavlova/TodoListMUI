import { AppThunk } from '../../store';
import { setStatusAppAC, setSuccessAppAC } from "../app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "../../../utils/error-utils";
import { LoginParamsType, authApi } from "../../../api/auth-api";
import { ResultCode } from "../tasks/tasks-reducer";
import { SetTodoListTC } from "../todolists/todolists-reducer";

export type AuthActionType = ReturnType<typeof setIsLoggedInAC>

export type initialParamsAuthType = {
  isLoggedIn: boolean
}

const initialParamsAuth = {
  isLoggedIn: false //залогин пользователь или нет
}

export const authReducer = (state = initialParamsAuth, action: AuthActionType): initialParamsAuthType => {
  switch (action.type) {
    case "LOGIN/IS-LOGIN-IN":
      return { ...state, isLoggedIn: action.isLoggedIn }
    default:
      return state
  }
}

//action creator
export const setIsLoggedInAC = (isLoggedIn: boolean) => {
  return {
    type: "LOGIN/IS-LOGIN-IN", isLoggedIn
  } as const //для явного указания типа литерала на основе конкретного значения 
}


//thunks
export const LoginTC = (params: LoginParamsType): AppThunk =>
  async dispatch => {
    dispatch(setStatusAppAC("loading"))
    try {
      const res = await authApi.login(params)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(setIsLoggedInAC(true))
        dispatch(SetTodoListTC())
        dispatch(setSuccessAppAC("you have successfully logged in"))
        dispatch(setStatusAppAC("succeeded"))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }


export const LogOutTC = (): AppThunk =>
  async dispatch => {
    dispatch(setStatusAppAC("loading"))
    try {
      const res = await authApi.logOut()
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(setIsLoggedInAC(false))
        dispatch(SetTodoListTC())
        dispatch(setSuccessAppAC("you have successfully logged out"))
        dispatch(setStatusAppAC("succeeded"))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }