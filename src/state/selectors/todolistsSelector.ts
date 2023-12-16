import { TodolistDomainTypeApi } from "../reducers/todolists/todolists-reducer";
import { AppRootStateType } from "../store";

export const todolistsSelector = (state: AppRootStateType): TodolistDomainTypeApi[] => state.todolists