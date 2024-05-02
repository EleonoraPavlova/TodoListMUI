import {
  PayloadAction,
  createSlice,
  isAnyOf,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit'
import { todolistsThunks } from '../todolistsSlice'
import { appInitial } from 'BLL/initialState'
import { authApi } from 'DAL/auth-api'
import { ResultCode } from 'common/emuns'
import { createAppAsyncThunk } from 'common/utils'
import { tasksThunks } from '../tasksSlice'

const appSlice = createSlice({
  name: 'app',
  initialState: appInitial,
  reducers: {
    setErrorAppAC(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error
    },
    setSuccessAppAC(state, action: PayloadAction<{ success: string | null }>) {
      state.success = action.payload.success
    },
    setInitializeAppAC(state) {
      state.initialized = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isAnyOf(setInitializeAppTC.fulfilled, setInitializeAppTC.rejected), (state) => {
        state.initialized = true
      })
      .addMatcher(isPending, (state) => {
        state.status = 'loading'
      })
      .addMatcher(isFulfilled, (state) => {
        state.status = 'succeeded'
      })
      .addMatcher(isRejected, (state, action: any) => {
        state.status = 'failed'
        if (
          action.type === todolistsThunks.addTodolistTC.rejected.type ||
          action.type === tasksThunks.addTaskTC.rejected.type ||
          action.type === setInitializeAppTC.rejected.type
        )
          return
        if (action.payload) {
          state.error = action.payload.errors[0]
        } else {
          state.error = action.error.message ? action.error.message : 'Some error occurred'
        }
      })
  },
  //action.payload.messages[0]
  selectors: {
    statusAppSelector: (slice) => slice.status,
    errorAppSelector: (slice) => slice.error,
    successAppSelector: (slice) => slice.success,
    initializedAppSelector: (slice) => slice.initialized,
  },
})

export const setInitializeAppTC = createAppAsyncThunk<{ isLoggedIn: boolean }>(
  `${appSlice.name}/setInitializeApp`,
  async (_, { dispatch, rejectWithValue }) => {
    const res = await authApi.authMe()
    // anonymous user or authorization
    if (res.data.resultCode === ResultCode.SUCCEEDED) {
      dispatch(todolistsThunks.setTodoListTC())
      return { isLoggedIn: true }
    } else {
      return rejectWithValue(res.data)
    }
  }
)

export const appReducer = appSlice.reducer
export const appThunks = { setInitializeAppTC }
export const { setErrorAppAC, setSuccessAppAC } = appSlice.actions
export const { statusAppSelector, errorAppSelector, successAppSelector, initializedAppSelector } =
  appSlice.selectors
