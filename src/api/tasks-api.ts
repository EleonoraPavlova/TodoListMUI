//DAL level
//в api не должно быть ничего кроме axios
import { instance } from "./todolist-api"

export enum TaskStatuses {
  New = 0, // false
  inProgress = 1,
  Completed = 2, // true
  Draft = 3
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4
}

export type TaskTypeApi = {
  description: string
  title: string
  completed: boolean
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}


type ResponseTasksGetType = {
  items: TaskTypeApi[]
  totalCount: number
  error: string
}

export type OperationResult<T = {}> = {
  data: T
  resultCode: number
  messages: string[]
}

export type UpdateTaskModelType = { //что ожидает метод put in request
  title: string
  description: string
  completed: boolean
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}

export const tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<ResponseTasksGetType>(`/todo-lists/${todolistId}/tasks`)
  },

  createTasks(todolistId: string, title: string) {
    return instance.post<OperationResult<{ item: TaskTypeApi }>>(`/todo-lists/${todolistId}/tasks`, { title })
  },

  deleteTasks(todolistId: string, taskId: string) {
    return instance.delete<OperationResult>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  },

  updateTasks(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<OperationResult<{ item: TaskTypeApi }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
  }
}