import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { FieldsError, LoginParams } from 'common/types'
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from 'common/utils'
import { authInitial } from 'BLL/initialState'
import { setStatusAppAC, setSuccessAppAC } from '../appSlice'
import { authApi } from 'DAL/auth-api'
import { ResultCode } from 'common/emuns'
import { clearTasksTodolists } from 'BLL/actions/actions'
import { todolistsThunks } from '../todolistsSlice'
//as const для явного указания типа литерала на основе конкретного значения

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitial, //залогин пользователь или нет
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
      state.isLoggedIn = action.payload.isLoggedIn
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginTC.fulfilled, (state) => {
        state.isLoggedIn = true
      })
      .addCase(logOutTC.fulfilled, (state) => {
        state.isLoggedIn = false
      })
  },
  selectors: {
    isLoggedInSelector: (slice) => slice.isLoggedIn,
  },
})

export const loginTC = createAppAsyncThunk<
  { isLoggedIn: boolean },
  LoginParams,
  {
    rejectValue: { errors: string[]; fieldsErrors?: FieldsError[] }
  }
>(`${authSlice.name}/login`, async (params, { dispatch, rejectWithValue }) => {
  dispatch(setStatusAppAC({ status: 'loading' }))
  try {
    const res = await authApi.login(params)
    if (res.data.resultCode === ResultCode.SUCCEEDED) {
      dispatch(todolistsThunks.setTodoListTC())
      dispatch(setSuccessAppAC({ success: 'you have successfully logged in' }))
      dispatch(setStatusAppAC({ status: 'succeeded' }))
      return { isLoggedIn: true }
    } else {
      handleServerAppError(res.data.messages, dispatch)
      return rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors })
    }
  } catch (err) {
    //server crashed
    const error: AxiosError = err as AxiosError
    handleServerNetworkError(err as { message: string }, dispatch)
    return rejectWithValue({ errors: [error.message], fieldsErrors: undefined })
  }
})

const logOutTC = createAppAsyncThunk<
  { isLoggedIn: boolean },
  void,
  {
    rejectValue: { errors: string[]; fieldsErrors?: FieldsError[] }
  }
>(`${authSlice.name}/logOut`, async (params, { dispatch, rejectWithValue }) => {
  dispatch(setStatusAppAC({ status: 'loading' }))
  try {
    const res = await authApi.logOut()
    if (res.data.resultCode === ResultCode.SUCCEEDED) {
      // dispatch(setIsLoggedInAC(false))
      dispatch(setSuccessAppAC({ success: 'you have successfully logged out' }))
      dispatch(setStatusAppAC({ status: 'succeeded' }))
      dispatch(clearTasksTodolists({ tasks: {}, todolists: [] }))
      return { isLoggedIn: false }
    } else {
      handleServerAppError(res.data.messages, dispatch)
      return rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors })
    }
  } catch (err) {
    //server crashed
    const error: AxiosError = err as AxiosError
    handleServerNetworkError(err as { message: string }, dispatch)
    return rejectWithValue({ errors: [error.message], fieldsErrors: undefined })
  }
})

export const authReducer = authSlice.reducer
export const authThunks = { loginTC, logOutTC }
export const { setIsLoggedInAC } = authSlice.actions
export const { isLoggedInSelector } = authSlice.selectors
