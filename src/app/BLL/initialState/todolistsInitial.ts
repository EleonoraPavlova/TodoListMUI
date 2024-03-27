import { TodolistDomain } from 'common/types'

export const todolistInitial: { todolists: TodolistDomain[] } = {
  todolists: [
    {
      id: 'todoListId1',
      title: 'HTML&CSS',
      filter: 'all',
      addedDate: '',
      order: 1,
      entityStatus: 'idle',
    },
    {
      id: 'todoListId2',
      title: 'Something',
      filter: 'all',
      addedDate: '',
      order: 2,
      entityStatus: 'loading',
    },
  ],
}
