import { AppThunk } from '../../store';
import { handleServerAppError, handleServerNetworkError } from "../../../utils/error-utils";
import { LoginParamsType, authApi } from "../../../api/auth-api";
import { ResultCode } from "../tasks/tasks-reducer";
import { SetTodoListTC, clearTodoListAC } from "../todolists/todolists-reducer";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { setStatusAppAC, setSuccessAppAC } from "../app/app-reducer";
//as const для явного указания типа литерала на основе конкретного значения 

export const initialParamsAuth = {
  isLoggedIn: false //залогин пользователь или нет
}

const slice = createSlice({
  name: "auth",
  initialState: initialParamsAuth,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.isLoggedIn = action.payload.isLoggedIn
    }
  }
})

export const authReducer = slice.reducer
export const { setIsLoggedInAC } = slice.actions


//thunks
export const LoginTC = (params: LoginParamsType): AppThunk =>
  async dispatch => {
    dispatch(setStatusAppAC({ status: "loading" }))
    try {
      const res = await authApi.login(params)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        // dispatch(setIsLoggedInAC(true))
        dispatch(SetTodoListTC())
        dispatch(setSuccessAppAC({ success: "you have successfully logged in" }))
        dispatch(setStatusAppAC({ status: "succeeded" }))
        return { isLoggedIn: true }
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }


export const LogOutTC = (): AppThunk =>
  async dispatch => {
    dispatch(setStatusAppAC({ status: "loading" }))
    try {
      const res = await authApi.logOut()
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        // dispatch(setIsLoggedInAC(false))
        dispatch(setSuccessAppAC({ success: "you have successfully logged out" }))
        dispatch(setStatusAppAC({ status: "succeeded" }))
        dispatch(clearTodoListAC())
        return { isLoggedIn: false }
      } else {
        handleServerAppError(res.data, dispatch)
      }
    } catch (err) {
      handleServerNetworkError(err as { message: string }, dispatch)
    }
  }