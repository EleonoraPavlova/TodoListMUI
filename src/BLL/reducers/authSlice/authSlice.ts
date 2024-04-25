import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { LoginParams } from 'common/types'
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from 'common/utils'
import { authInitial } from 'BLL/initialState'
import { setStatusAppAC, setSuccessAppAC } from '../appSlice'
import { authApi } from 'DAL/auth-api'
import { ResultCode } from 'common/emuns'
import { clearTasksTodolists } from 'BLL/actions/actions'
import { todolistsThunks } from '../todolistsSlice'
import { thunkTryCatch } from 'common/utils/thunkTryCatch'
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

export const loginTC = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParams>(
  `${authSlice.name}/login`,
  (params, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
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
    })
  }
)

const logOutTC = createAppAsyncThunk<{ isLoggedIn: boolean }>(
  `${authSlice.name}/logOut`,
  async (params, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await authApi.logOut()
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        // dispatch(setIsLoggedInAC(false))
        dispatch(setSuccessAppAC({ success: 'you have successfully logged out' }))
        dispatch(setStatusAppAC({ status: 'succeeded' }))
        dispatch(clearTasksTodolists({ tasks: {}, todolists: [] }))
        return { isLoggedIn: false }
      } else {
        const isShowAppError = !res.data.fieldsErrors.length
        handleServerAppError(res.data.messages, dispatch, isShowAppError)
        return rejectWithValue({
          errors: res.data.messages,
          fieldsErrors: res.data.fieldsErrors,
        })
      }
    })
  }
)

export const authReducer = authSlice.reducer
export const authThunks = { loginTC, logOutTC }
export const { setIsLoggedInAC } = authSlice.actions
export const { isLoggedInSelector } = authSlice.selectors
