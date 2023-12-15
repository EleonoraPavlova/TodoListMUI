//DAL level
import axios from "axios"

export const instance = axios.create({
  withCredentials: true,
  //чтобы цеплялась кука к запросу(чтобы распознать пользователя авторизован или нет)
  baseURL: "https://social-network.samuraijs.com/api/1.1",
  headers: {
    "API-KEY": "6a891b51-a742-4c47-8da1-58a8df99feb7"
  }
})


export type TodolistTypeApi = {
  id: string
  addedDate: string
  order: number
  title: string
}


export type ResponseType<T = {}> = {
  resultCode: number
  messages: string[]
  fieldsErrors: string[]
  data: T
}


export const todolistApi = {
  getTodo() {
    return instance.get<TodolistTypeApi[]>('/todo-lists')
  },

  createTodo(title: string) {
    return instance.post<ResponseType<{ item: TodolistTypeApi }>>('/todo-lists', { title })
  },

  deleteTodo(todolistId: string) {
    return instance.delete<ResponseType>(`/todo-lists/${todolistId}`)
  },

  updateTodo(todolistId: string, title: string) {
    return instance.put<ResponseType>(`/todo-lists/${todolistId}`, { title })
  }
}