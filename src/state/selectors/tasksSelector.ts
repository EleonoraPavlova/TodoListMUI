import { TasksStateType } from "../../apps/AppRedux";
import { AppRootStateType } from "../store";

export const tasksSelector = (state: AppRootStateType): TasksStateType => state.tasks