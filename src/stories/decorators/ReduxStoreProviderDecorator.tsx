import React from 'react'
import { Provider } from 'react-redux'
import { combineReducers } from 'redux'
import { tasksReducer } from '../../state/reducers/tasks/tasksSlice'
import { todolistReducer } from '../../state/reducers/todolists/todolistsSlice'
import { InitialStateApp, appReducer } from '../../state/reducers/app/appSlice'
import { configureStore } from '@reduxjs/toolkit'
import { tasksInitialState } from '../../state/initialState/tasksInitialState'
import { todolistInitialState } from '../../state/initialState/todolistsInitialState'
import { authReducer, initialParamsAuth } from '../../state/reducers/auth/authSlice'
import { MemoryRouter } from 'react-router-dom'

//создали моковый по сути стор для демонстрации
const rootReducerMoc = combineReducers({
  todolists: todolistReducer,
  tasks: tasksReducer,
  app: appReducer,
  auth: authReducer,
})

const initialGlobalStateMoc: AppRootStateTypeMoc = {
  todolists: todolistInitialState,
  tasks: tasksInitialState,
  app: InitialStateApp,
  auth: initialParamsAuth,
}

export type AppRootStateTypeMoc = ReturnType<typeof rootReducerMoc>

export const storyBookStore = configureStore({ reducer: rootReducerMoc, preloadedState: undefined })

storyBookStore.dispatch({ type: 'SET-TODOLISTS', todolists: initialGlobalStateMoc.todolists })
storyBookStore.dispatch({ type: 'SET-TASKS', tasks: initialGlobalStateMoc.tasks })
storyBookStore.dispatch({ type: 'SET-APP-STATUS', status: initialGlobalStateMoc.app.status })

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  // React. ReactNode - это набор всех возможных значений, возвращаемых компонентом
  return (
    <MemoryRouter>
      <Provider store={storyBookStore}>{storyFn()}</Provider>
    </MemoryRouter>
  )
}
