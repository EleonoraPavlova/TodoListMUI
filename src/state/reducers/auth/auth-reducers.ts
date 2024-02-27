import { handleServerAppError, handleServerNetworkError } from "../../../utils/error-utils";
import { LoginParamsType, authApi } from "../../../api/auth-api";
import { ResultCode } from "../tasks/tasks-reducer";
import { setTodoListTC } from "../todolists/todolists-reducer";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setStatusAppAC, setSuccessAppAC } from "../app/app-reducer";
import { AxiosError } from "axios";
import { FieldsErrorType } from "../../../api/todolist-api";
import { clearTasksTodolists } from "../../../actions/actions";
//as const для явного указания типа литерала на основе конкретного значения 

export const initialParamsAuth = {
  isLoggedIn: false //залогин пользователь или нет
}

export const loginTC = createAsyncThunk<undefined, LoginParamsType, {
  rejectValue: { errors: string[], fieldsErrors?: FieldsErrorType[] }
}
>("auth/login", async (params, { dispatch, rejectWithValue }) => {
  dispatch(setStatusAppAC({ status: "loading" }))
  try {
    const res = await authApi.login(params)
    if (res.data.resultCode === ResultCode.SUCCEEDED) {
      dispatch(setTodoListTC())
      dispatch(setSuccessAppAC({ success: "you have successfully logged in" }))
      dispatch(setStatusAppAC({ status: "succeeded" }))
      return
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors })
    }
  } catch (err) {//server crashed
    const error: AxiosError = err as AxiosError
    handleServerNetworkError(err as { message: string }, dispatch)
    return rejectWithValue({ errors: [error.message], fieldsErrors: undefined })
  }
})

export const logOutTC = createAsyncThunk<undefined, void, {
  rejectValue: { errors: string[], fieldsErrors?: FieldsErrorType[] }
}
>("auth/logOut", async (params, { dispatch, rejectWithValue }) => {
  dispatch(setStatusAppAC({ status: "loading" }))
  try {
    const res = await authApi.logOut()
    if (res.data.resultCode === ResultCode.SUCCEEDED) {
      // dispatch(setIsLoggedInAC(false))
      dispatch(setSuccessAppAC({ success: "you have successfully logged out" }))
      dispatch(setStatusAppAC({ status: "succeeded" }))
      dispatch(clearTasksTodolists({ tasks: {}, todolists: [] }))
      return
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors })
    }
  } catch (err) {//server crashed
    const error: AxiosError = err as AxiosError
    handleServerNetworkError(err as { message: string }, dispatch)
    return rejectWithValue({ errors: [error.message], fieldsErrors: undefined })
  }
})

const slice = createSlice({
  name: "auth",
  initialState: initialParamsAuth,
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.isLoggedIn = action.payload.isLoggedIn
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginTC.fulfilled, (state) => {
        state.isLoggedIn = true
      })
      .addCase(logOutTC.fulfilled, (state) => {
        state.isLoggedIn = false
      })
  }
})

export const authReducer = slice.reducer
export const { setIsLoggedInAC } = slice.actions