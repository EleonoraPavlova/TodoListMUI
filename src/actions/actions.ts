import { createAction } from "@reduxjs/toolkit";
import { TodolistDomainTypeApi } from "../state/reducers/todolists/todolists-reducer";
import { TasksStateType } from "../apps/AppRedux";


export type ClearTasksTodolistsType = {
  tasks: TasksStateType,
  todolists: TodolistDomainTypeApi[]
}

export const clearTasksTodolists = createAction<ClearTasksTodolistsType>('actions/clearTasksTodolists')