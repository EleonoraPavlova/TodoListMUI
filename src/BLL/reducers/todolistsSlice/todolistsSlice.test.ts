import { todolistInitial } from 'BLL/initialState'
import { changeTodolistEntityStatusAC, todolistReducer, todolistsThunks } from './todolistsSlice'
import { RequestStatus, UpdateTodolistPayload } from 'common/types'

let startState = todolistInitial

test('correct todolist should be removed', () => {
  const endState = todolistReducer(
    startState,
    todolistsThunks.removeTodolistTC.fulfilled({ todoListId: 'todoListId1' }, '', 'requestId')
  )

  expect(endState.todolists.length).toBe(1)
  expect(endState.todolists[0].id).toBe('todoListId2')
})

test('should be added correct todolist ', () => {
  let newTodolist = {
    id: 'todoListId1',
    title: 'Added todolist',
    filter: 'all',
    addedDate: '',
    order: 1,
  }

  const endState = todolistReducer(
    startState,
    todolistsThunks.addTodolistTC.fulfilled({ todolist: newTodolist }, '', 'requestId')
  )

  expect(endState.todolists.length).toBe(3)
  expect(endState.todolists[0].order).toBe(1)
  expect(endState.todolists.length).toBe(3)
})

test('should be change title todolist ', () => {
  const params: UpdateTodolistPayload = {
    todoListId: 'todoListId1',
    title: 'Change title',
    filter: 'all',
  }
  const endState = todolistReducer(
    startState,
    todolistsThunks.updateTodolistTC.fulfilled(params, '', params)
  )

  expect(endState.todolists.length).toBe(2)
  expect(endState.todolists[1].title).toBe(params.title)
})

test('should be change filter todolist ', () => {
  const params: UpdateTodolistPayload = {
    todoListId: 'todoListId2',
    title: startState.todolists[1].title,
    filter: 'active',
  }
  const endState = todolistReducer(
    startState,
    todolistsThunks.updateTodolistTC.fulfilled(params, '', params)
  )

  expect(endState.todolists.length).toBe(2)
  expect(endState.todolists[1].filter).toBe('active')
})

test('todolist should be set', () => {
  const endState = todolistReducer(
    { todolists: [] },
    todolistsThunks.setTodoListTC.fulfilled({ todoLists: startState.todolists }, 'requestId')
  )

  const keys = Object.keys(endState)

  expect(keys.length).toBe(2) //одно и тоже
  expect(endState.todolists.length).toBe(2) //
  expect(endState.todolists[1].id).toBe('todoListId2')
  expect(endState.todolists[0].id).toBe('todoListId1')
})

test('todolist entityStatus should be changed', () => {
  let newStatus: RequestStatus = 'succeeded'
  const endState = todolistReducer(
    startState,
    changeTodolistEntityStatusAC({
      todoListId: startState.todolists[0].id,
      entityStatus: newStatus,
    })
  )

  expect(endState.todolists[0].entityStatus).toBe(newStatus)
  expect(startState.todolists[0].entityStatus).toBe('idle')
})
