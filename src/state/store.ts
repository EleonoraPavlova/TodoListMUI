import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { tasksReducer } from './reducers/tasks/tasksSlice'
import { appReducer } from './reducers/app/appSlice'
import { todolistReducer } from './reducers/todolists/todolistsSlice'
import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './reducers/auth/authSlice'

export type AppRootStateType = ReturnType<typeof store.getState>

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppRootStateType,
  unknown,
  Action<string>
>

export const store = configureStore({
  reducer: {
    todolists: todolistReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer,
  },
})
// export type AppDispatchType = ThunkDispatch<AppRootStateType, unknown, Action>
export type AppDispatchType = typeof store.dispatch

//@ts-ignore
window.store = store
