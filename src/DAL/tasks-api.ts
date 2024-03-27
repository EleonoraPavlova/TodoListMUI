import { instance } from './instance'
import { DeleteParamsTask, ResponseBase, Task, UpdateParamsTask } from 'common/types'

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

  deleteTask(params: DeleteParamsTask) {
    return instance.delete<ResponseBase>(`/todo-lists/${params.todoListId}/tasks/${params.taskId}`)
  },

  updateTask(params: UpdateParamsTask) {
    return instance.put<ResponseBase<{ item: Task }>>(
      `/todo-lists/${params.todoListId}/tasks/${params.taskId}`,
      params.model
    )
  },
}
