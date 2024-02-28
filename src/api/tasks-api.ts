//DAL level
//в api не должно быть ничего кроме axios
import { instance } from './todolist-api'
import { ResponseType } from './todolist-api'

export enum TaskStatuses {
  New = 0, // false
  inProgress = 1,
  Completed = 2, // true
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
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

// export type OperationResult<T = {}> = {
//   data: T
//   resultCode: number
//   messages: string[]
// }

export type UpdateTaskModelType = {
  //что ожидает метод put in request
  title: string
  description: string
  completed: boolean
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}

export const tasksApi = {
  getTasks(todoListId: string) {
    return instance.get<ResponseTasksGetType>(`/todo-lists/${todoListId}/tasks`)
  },

  createTasks(todoListId: string, title: string) {
    return instance.post<ResponseType<{ item: TaskTypeApi }>>(`/todo-lists/${todoListId}/tasks`, {
      title,
    })
  },

  deleteTask(todoListId: string, taskId: string) {
    return instance.delete<ResponseType>(`/todo-lists/${todoListId}/tasks/${taskId}`)
  },

  updateTasks(todoListId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<ResponseType<{ item: TaskTypeApi }>>(
      `/todo-lists/${todoListId}/tasks/${taskId}`,
      model
    )
  },
}
