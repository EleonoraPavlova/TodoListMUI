import { PayloadAction, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit'
import { todolistsThunks } from '../todolistsSlice'
import { appInitial } from 'BLL/initialState'
import { handleServerAppError } from 'common/utils/handleServerAppError'
import { authApi } from 'DAL/auth-api'
import { ResultCode } from 'common/emuns'
import { createAppAsyncThunk } from 'common/utils'
import { setIsLoggedInAC } from '../authSlice'
import { thunkTryCatch } from 'common/utils'

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(setInitializeAppTC.fulfilled, (state) => {
        state.initialized = true
      })
      .addMatcher(isPending, (state) => {
        state.status = 'loading'
      })
      .addMatcher(isRejected, (state) => {
        state.status = 'failed'
      })
      .addMatcher(isFulfilled, (state) => {
        state.status = 'succeeded'
      })
  },
  selectors: {
    statusAppSelector: (slice) => slice.status,
    errorAppSelector: (slice) => slice.error,
    successAppSelector: (slice) => slice.success,
    initializedAppSelector: (slice) => slice.initialized,
  },
})

export const setInitializeAppTC = createAppAsyncThunk<{ initialized: boolean }>(
  `${appSlice.name}/setInitializeApp`,
  (params, thunkAPI) => {
    const { dispatch } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await authApi.authMe()
      // anonymous user or authorization
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(setIsLoggedInAC({ isLoggedIn: true }))
        dispatch(todolistsThunks.setTodoListTC())
      } else {
        handleServerAppError(res.data.messages, dispatch, false)
      }
      return { initialized: true }
    })
  }
)

export const appReducer = appSlice.reducer
export const appThunks = { setInitializeAppTC }
export const { setErrorAppAC, setSuccessAppAC } = appSlice.actions
export const { statusAppSelector, errorAppSelector, successAppSelector, initializedAppSelector } =
  appSlice.selectors
export { isPending, isRejected, isFulfilled }
