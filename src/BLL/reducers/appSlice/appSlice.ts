import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { todolistsThunks } from '../todolistsSlice'
import { RequestStatus } from 'common/types'
import { appInitial } from 'BLL/initialState'
import { handleServerAppError } from 'common/utils/handleServerAppError'
import { authApi } from 'DAL/auth-api'
import { ResultCode } from 'common/emuns'
import { handleServerNetworkError } from 'common/utils'
import { setIsLoggedInAC } from '../authSlice'

const appSlice = createSlice({
  name: 'app',
  initialState: appInitial,
  reducers: {
    setErrorAppAC(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error
    },
    setStatusAppAC(state, action: PayloadAction<{ status: RequestStatus }>) {
      state.status = action.payload.status
    },
    setSuccessAppAC(state, action: PayloadAction<{ success: string | null }>) {
      state.success = action.payload.success
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setInitializeAppTC.fulfilled, (state) => {
      state.initialized = true
    })
  },
  selectors: {
    statusAppSelector: (slice) => slice.status,
    errorAppSelector: (slice) => slice.error,
    successAppSelector: (slice) => slice.success,
    initializedAppSelector: (slice) => slice.initialized,
  },
})

const setInitializeAppTC = createAsyncThunk(
  `${appSlice.name}/setInitializeApp`,
  async (params, { dispatch, rejectWithValue }) => {
    dispatch(setStatusAppAC({ status: 'loading' }))
    try {
      const res = await authApi.authMe()
      // анонимный пользователь или авториз
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        dispatch(setIsLoggedInAC({ isLoggedIn: true }))
        dispatch(setStatusAppAC({ status: 'succeeded' }))
        dispatch(todolistsThunks.setTodoListTC())
      } else {
        handleServerAppError(res.data.messages, dispatch)
        return rejectWithValue({})
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      return rejectWithValue({})
    } finally {
      return
      //под капотом происходит dispatch(setInitializeAppAC({ initialized: true }))
    }
  }
)

export const appReducer = appSlice.reducer
export const appThunks = { setInitializeAppTC }
export const { setErrorAppAC, setStatusAppAC, setSuccessAppAC } = appSlice.actions
export const { statusAppSelector, errorAppSelector, successAppSelector, initializedAppSelector } =
  appSlice.selectors
