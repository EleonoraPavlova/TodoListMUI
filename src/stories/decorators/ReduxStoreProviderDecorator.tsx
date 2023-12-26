import React from 'react'
import { Provider } from 'react-redux';
import { combineReducers } from "redux";
import { tasksReducer } from '../../state/reducers/tasks/tasks-reducer';
import { todolistReducer } from "../../state/reducers/todolists/todolists-reducer";
import { appReducer } from "../../state/reducers/app/app-reducer";
import { appInitialStatusState } from "../../state/initialState/appInitialStatusState";
import { configureStore } from "@reduxjs/toolkit";
import { tasksInitialState } from "../../state/initialState/tasksInitialState";
import { AppRootStateType } from "../../state/store";
import { todolistInitialState } from "../../state/initialState/todolistsInitialState";


//создали моковый по сути стор для демонстрации
const rootReducerMoc = combineReducers({
  todolists: todolistReducer,
  tasks: tasksReducer,
  app: appReducer
})


const initialGlobalStateMoc: AppRootStateTypeMoc = {
  todolists: todolistInitialState,
  tasks: tasksInitialState,
  app: appInitialStatusState
};

export type AppRootStateTypeMoc = ReturnType<typeof rootReducerMoc>

export const storyBookStore = configureStore({ reducer: rootReducerMoc, preloadedState: undefined })

storyBookStore.dispatch({ type: 'SET-TODOLISTS', todolists: initialGlobalStateMoc.todolists })
storyBookStore.dispatch({ type: 'SET-TASKS', tasks: initialGlobalStateMoc.tasks })
storyBookStore.dispatch({ type: 'SET-APP-STATUS', status: initialGlobalStateMoc.app.status })

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  // React. ReactNode - это набор всех возможных значений, возвращаемых компонентом
  return <Provider store={storyBookStore}>{storyFn()}</Provider>
}