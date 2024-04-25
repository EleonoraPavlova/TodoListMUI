import { instance } from './instance'
import { ResponseBase, Task, UpdateParamsTask } from 'common/types'

type ResponseTasksGet = {
  items: Task[]
  totalCount: number
  error: string
}

export const tasksApi = {
  getTasks(todoListId: string) {
    return instance.get<ResponseTasksGet>(`/todo-lists/${todoListId}/tasks`)
  },

  createTasks(todoListId: string, title: string) {
    return instance.post<ResponseBase<{ item: Task }>>(`/todo-lists/${todoListId}/tasks`, {
      title,
    })
  },

  deleteTask(params: Omit<UpdateParamsTask, 'model'>) {
    return instance.delete<ResponseBase>(`/todo-lists/${params.todoListId}/tasks/${params.taskId}`)
  },

  updateTask(params: UpdateParamsTask) {
    return instance.put<ResponseBase<{ item: Task }>>(
      `/todo-lists/${params.todoListId}/tasks/${params.taskId}`,
      params.model
    )
  },
}
