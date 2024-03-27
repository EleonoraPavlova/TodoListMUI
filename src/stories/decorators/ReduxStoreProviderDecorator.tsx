import React from 'react'
import { Provider } from 'react-redux'
import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import { todolistReducer } from 'BLL/reducers/todolistsSlice'
import { tasksReducer } from 'BLL/reducers/tasksSlice'
import { appReducer } from 'BLL/reducers/appSlice'
import { authReducer } from 'BLL/reducers/authSlice'
import { appInitial, authInitial, tasksInitial, todolistInitial } from 'BLL/initialState'

//создали моковый по сути стор для демонстрации
const rootReducerMoc = combineReducers({
  app: appReducer,
  auth: authReducer,
  todolists: todolistReducer,
  tasks: tasksReducer,
})

const initialGlobalStateMoc: AppRootStateMoc = {
  app: appInitial,
  auth: authInitial,
  todolists: todolistInitial,
  tasks: tasksInitial,
}

export type AppRootStateMoc = ReturnType<typeof rootReducerMoc>

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
