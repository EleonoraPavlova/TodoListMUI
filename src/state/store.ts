import { Action, combineReducers } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { tasksReducer } from "./reducers/tasks/tasks-reducer";
import { appReducer } from "./reducers/app-reducer/app-reducer";
import { todolistReducer } from "./reducers/todolists/todolists-reducer";
import { configureStore } from "@reduxjs/toolkit";

export type AppRootStateType = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
  todolist: todolistReducer,
  tasks: tasksReducer,
  app: appReducer
})


export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppRootStateType,
  unknown,
  Action<string>
>;

export const store = configureStore({ reducer: rootReducer })
export type AppDispatchType = ThunkDispatch<AppRootStateType, unknown, Action>

//@ts-ignore
window.store = store