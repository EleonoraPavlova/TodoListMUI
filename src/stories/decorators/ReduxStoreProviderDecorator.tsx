import React from 'react'
import { Provider } from 'react-redux';
import { combineReducers } from "redux";
import { tasksReducer } from '../../state/reducers/tasks/tasks-reducer';
import { todolistReducer } from "../../state/reducers/todolists/todolists-reducer";
import { todolistInitialState } from "../../state/initialState/todolistsInitialState";
import { appReducer } from "../../state/reducers/app-reducer/app-reducer";
import { appInitialStatusState } from "../../state/initialState/appInitialStatusState";
import { configureStore } from "@reduxjs/toolkit";
import { tasksInitialState } from "../../state/initialState/tasksInitialState";


//создали моковый по сути стор для демонстрации
const rootReducerMoc = combineReducers({
  tasks: tasksReducer,
  todolists: todolistReducer,
  app: appReducer
})

type AppRootStateMoc = ReturnType<typeof rootReducerMoc>

const initialGlobalState: AppRootStateMoc = {
  todolists: todolistInitialState,
  tasks: tasksInitialState,
  app: appInitialStatusState
};

export const storyBookStore = configureStore({ reducer: rootReducerMoc })
//export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState, applyMiddleware(thunk));


export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  // React. ReactNode - это набор всех возможных значений, возвращаемых компонентом
  return <Provider store={storyBookStore}>{storyFn()}</Provider>
}