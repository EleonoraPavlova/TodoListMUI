import { Tasks, TodolistDomain } from 'common/types'
import { tasksReducer } from '../tasksSlice'
import { tasksInitial, todoListId1, todoListId2 } from 'app/BLL/initialState'
import { todolistReducer, todolistsThunks } from '../todolistsSlice'

test('ids should be equals', () => {
  const startTasksState: Tasks = {}
  const startTodolistsState: { todolists: TodolistDomain[] } = { todolists: [] }
  let newTodolist = {
    id: todoListId1,
    title: 'Added todolist',
    filter: 'all',
    addedDate: '',
    order: 1,
  }

  const action = todolistsThunks.addTodolistTC.fulfilled({ todolist: newTodolist }, '', 'requestId')

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState.todolists[0].id

  expect(idFromTasks).toBe(action.payload.todolist.id) //сравниваю с тем значением которое должно прийти из action типа
  expect(idFromTodolists).toBe(action.payload.todolist.id)
})

test('property with todoListId should be deleted', () => {
  const startState = tasksInitial

  const action = todolistsThunks.removeTodolistTC.fulfilled(
    { todoListId: todoListId2 },
    '',
    'requestId'
  )
  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState['todoListId2']).not.toBeDefined()
})
