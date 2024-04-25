import { TaskPriorities, TaskStatuses } from 'common/emuns'

export type FilterValues = 'all' | 'active' | 'completed'

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed' //статус взаимодействия с сервером

//todolist
export type TodolistApi = {
  id: string
  addedDate: string
  order: number
  title: string
}

export type TodolistDomain = TodolistApi & {
  //расширяю тип который приходить с backend
  filter: FilterValues
  entityStatus: RequestStatus
}

export type UpdateTodolistPayload = {
  todoListId: string
  title: string
  filter: FilterValues
}

//task
export type Task = {
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

export type Tasks = Record<string, Task[]>

export type UpdateTaskModel = {
  //что ожидает метод put in request
  title: string
  description: string
  completed: boolean
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}

export type UpdateParamsTask = {
  todoListId: string
  taskId: string
  model: Partial<UpdateTaskModel> | UpdateTaskModel
}

//
export type FieldsError = {
  field: string
  error: string
}

export type ThunkErrorApiConfig = {
  errors: string[]
  fieldsErrors: string[] | FieldsError[]
}

//
export type ResponseBase<T = {}> = {
  resultCode: number
  messages: string[]
  fieldsErrors: FieldsError[]
  data: T
}

//initial
export type AppInitialState = {
  status: RequestStatus
  error: string | null //текст приходящей ошибки
  success: string | null
  initialized: boolean
}

//
export type LoginParams = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: boolean
}
