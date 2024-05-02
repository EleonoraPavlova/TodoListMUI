import { createSlice, isFulfilled } from '@reduxjs/toolkit'
import { LoginParams } from 'common/types'
import { createAppAsyncThunk, handleServerAppError } from 'common/utils'
import { authInitial } from 'BLL/initialState'
import { appThunks, setSuccessAppAC } from '../appSlice'
import { authApi } from 'DAL/auth-api'
import { ResultCode } from 'common/emuns'
import { clearTasksTodolists } from 'BLL/actions/actions'
import { todolistsThunks } from '../todolistsSlice'

//as const для явного указания типа литерала на основе конкретного значения

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitial,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      isFulfilled(loginTC, logOutTC, appThunks.setInitializeAppTC),
      (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      }
    )
  },
  selectors: {
    isLoggedInSelector: (slice) => slice.isLoggedIn,
  },
})

export const loginTC = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParams>(
  `${authSlice.name}/login`,
  async (params, { dispatch, rejectWithValue }) => {
    const res = await authApi.login(params)
    if (res.data.resultCode === ResultCode.SUCCEEDED) {
      dispatch(todolistsThunks.setTodoListTC())
      dispatch(setSuccessAppAC({ success: 'you have successfully logged in' }))
      return { isLoggedIn: true }
    } else {
      handleServerAppError(res.data.messages, dispatch)
      return rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors })
    }
  }
)

const logOutTC = createAppAsyncThunk<{ isLoggedIn: boolean }>(
  `${authSlice.name}/logOut`,
  async (_, { dispatch, rejectWithValue }) => {
    const res = await authApi.logOut()
    if (res.data.resultCode === ResultCode.SUCCEEDED) {
      dispatch(setSuccessAppAC({ success: 'you have successfully logged out' }))
      dispatch(clearTasksTodolists({ tasks: {}, todolists: [] }))
      return { isLoggedIn: false }
    } else {
      return rejectWithValue({
        errors: res.data.messages,
        fieldsErrors: res.data.fieldsErrors,
      })
    }
  }
)

export const authReducer = authSlice.reducer
export const authThunks = { loginTC, logOutTC }
export const { isLoggedInSelector } = authSlice.selectors
