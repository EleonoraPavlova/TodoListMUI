import { AppThunk } from '../../store';
import { setStatusAppAC, setSuccessAppAC } from "../app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "../../../utils/error-utils";
import { LoginParamsType, authApi } from "../../../api/auth-api";
import { ResultCode } from "../tasks/tasks-reducer";
import { setTodoListTC } from "../todolists/todolists-reducer";

export type AuthActionType = ReturnType<typeof setIsLoggedInAC>

export type initialParamsAuthType = {
  isLoggedIn: boolean
}

const initialParamsAuth = {
  isLoggedIn: false
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
export const loginTC = (params: LoginParamsType): AppThunk =>
  async dispatch => {
    dispatch(setStatusAppAC("loading"))
    try {
      const res = await authApi.login(params)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(setIsLoggedInAC(true))
        dispatch(setTodoListTC())
        dispatch(setSuccessAppAC("you have successfully logged in"))
        dispatch(setStatusAppAC("succeeded"))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (err) {
      handleServerNetworkError(err, dispatch)
    }
  }