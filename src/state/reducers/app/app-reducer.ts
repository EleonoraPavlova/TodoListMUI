import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { authApi } from "../../../api/auth-api"
import { handleServerAppError, handleServerNetworkError } from "../../../utils/error-utils"
import { ResultCode } from "../tasks/tasks-reducer"
import { setTodoListTC } from "../todolists/todolists-reducer"
import { setIsLoggedInAC } from "../auth/auth-reducers"

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed' //статус взаимодействия с сервером

export type InitialStateType = {
  status: RequestStatusType,
  error: string | null, //текст приходящей ошибки
  success: string | null,
  initialized: boolean
}


export let InitialStateApp: InitialStateType = {
  status: 'idle', //'idle'  - еще запроса не было - for loader App, меняется при каждом запросе на сервер!
  error: null, //нет никакой ошибки изначально //меняется при каждом запросе на сервер!
  success: null,
  initialized: false //(проверка куки, настроек пользователя)
}

export const setInitializeAppTC = createAsyncThunk('app/setInitializeApp', async (params, { dispatch, rejectWithValue }) => {
  dispatch(setStatusAppAC({ status: "loading" }))
  try {
    const res = await authApi.authMe()
    // анонимный пользователь или авториз
    if (res.data.resultCode === ResultCode.SUCCEEDED) {
      dispatch(setIsLoggedInAC({ isLoggedIn: true }))
      dispatch(setStatusAppAC({ status: "succeeded" }))
      dispatch(setTodoListTC())
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue({})
    }
  } catch (err) {
    handleServerNetworkError(err as { message: string }, dispatch)
    return rejectWithValue({})
  } finally {
    return
    //под капотом происходит dispatch(setInitializeAppAC({ initialized: true }))
  }
})

const slice = createSlice({
  name: "app",
  initialState: InitialStateApp,
  reducers: {
    // setInitializeAppAC(state, action: PayloadAction<{ initialized: boolean }>) {
    //   state.initialized = action.payload.initialized
    // },
    setErrorAppAC(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error
    },
    setStatusAppAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status
    },
    setSuccessAppAC(state, action: PayloadAction<{ success: string | null }>) {
      state.success = action.payload.success
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(setInitializeAppTC.fulfilled, (state) => {
        state.initialized = true
      })
  }
})


export const appReducer = slice.reducer
export const { setErrorAppAC, setStatusAppAC, setSuccessAppAC } = slice.actions