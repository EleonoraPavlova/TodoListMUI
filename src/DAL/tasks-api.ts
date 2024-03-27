import { instance } from './instance'
import { ResponseBase, Task, UpdateTaskModel } from 'common/types'

type ResponseTasksGetType = {
  items: Task[]
  totalCount: number
  error: string
}

export const tasksApi = {
  getTasks(todoListId: string) {
    return instance.get<ResponseTasksGetType>(`/todo-lists/${todoListId}/tasks`)
  },

  createTasks(todoListId: string, title: string) {
    return instance.post<ResponseBase<{ item: Task }>>(`/todo-lists/${todoListId}/tasks`, {
      title,
    })
  },

  deleteTask(todoListId: string, taskId: string) {
    return instance.delete<ResponseBase>(`/todo-lists/${todoListId}/tasks/${taskId}`)
  },

  updateTasks(todoListId: string, taskId: string, model: UpdateTaskModel) {
    return instance.put<ResponseBase<{ item: Task }>>(
      `/todo-lists/${todoListId}/tasks/${taskId}`,
      model
    )
  },
}
