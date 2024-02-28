import { todoListId1, todoListId2 } from './idState'
import { TodolistDomainTypeApi } from '../reducers/todolists/todolists-reducer'

export const todolistInitialState: TodolistDomainTypeApi[] = [
  {
    id: todoListId1,
    title: 'HTML&CSS',
    filter: 'all',
    addedDate: '',
    order: 1,
    entityStatus: 'idle',
  },
  {
    id: todoListId2,
    title: 'Something',
    filter: 'all',
    addedDate: '',
    order: 2,
    entityStatus: 'loading',
  },
]
