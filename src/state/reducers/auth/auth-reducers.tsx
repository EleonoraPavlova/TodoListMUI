import { AppThunk } from '../../store';
import { TasksStateType } from "../../../apps/App";
import { setStatusAppAC, setSuccessAppAC } from "../app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "../../../utils/error-utils";
import { RequestParamsType, authApi } from "../../../api/auth-api";
import { ResultCode } from "../tasks/tasks-reducer";


//пишем что нам нужно для выполения action, какие именно данные
export type AuthActionType =
  ReturnType<typeof loginAC>


const initialParamsAuth: RequestParamsType = {
  email: "",
  password: "",
  rememberMe: false,
  captcha: false
}


export const authReducer = (state = initialParamsAuth, action: AuthActionType): RequestParamsType => {
  switch (action.type) {
    case "APP/LOGIN":
      return action.params
    default: return state
  }
}

//функц action creator
export const loginAC = (params: RequestParamsType) => {
  return {
    type: "APP/LOGIN", params
  } as const //для явного указания типа литерала на основе конкретного значения 
}


//thunks
export const loginTC = (params: RequestParamsType): AppThunk =>
  async dispatch => {
    dispatch(setStatusAppAC("loading"))
    try {
      const res = await authApi.login(params)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(setSuccessAppAC("you have successfully logged in"))
        dispatch(setStatusAppAC("succeeded"))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (err) {
      handleServerNetworkError(err, dispatch)
    }
  }