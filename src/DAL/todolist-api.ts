import axios from 'axios'
import { instance } from './instance'
import { ResponseBase, TodolistApi } from 'common/types'

export const todolistApi = {
  getTodos() {
    return instance.get<TodolistApi[]>('/todo-lists')
  },

  createTodo(title: string) {
    return instance.post<ResponseBase<{ item: TodolistApi }>>('/todo-lists', { title })
  },

  deleteTodo(todoListId: string) {
    return instance.delete<ResponseBase>(`/todo-lists/${todoListId}`)
  },

  updateTodo(todoListId: string, title: string) {
    return instance.put<ResponseBase>(`/todo-lists/${todoListId}`, { title })
  },
}
