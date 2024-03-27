import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit'
import { appReducer, authReducer, tasksReducer, todolistReducer } from './reducers'

export type AppRootState = ReturnType<typeof store.getState>

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppRootState,
  unknown,
  Action<string>
>

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    todolists: todolistReducer,
    tasks: tasksReducer,
  },
})

export type AppDispatch = typeof store.dispatch

//@ts-ignore
window.store = store
