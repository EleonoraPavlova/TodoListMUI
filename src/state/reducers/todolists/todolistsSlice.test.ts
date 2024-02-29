import {
  addTodolistTC,
  changeTodolistEntityStatusAC,
  removeTodolistTC,
  setTodoListTC,
  todolistReducer,
  UpdateTodolistPayload,
  updateTodolistTC,
} from './todolistsSlice'
import { todoListId1, todoListId2 } from '../../initialState/idState'
import { todolistInitialState } from '../../initialState/todolistsInitialState'
import { RequestStatusType } from '../app/appSlice'

let startState = todolistInitialState

test('correct todolist should be removed', () => {
  //action можно писать вместо функц removeTodolistAC(todoListId1)
  // const action: removeTodolistACtion = { type: "REMOVE-TODOLIST", todoListId: todoListId1 }

  const endState = todolistReducer(
    startState,
    removeTodolistTC.fulfilled({ todoListId: todoListId1 }, '', 'requestId')
  ) //  todolistReducer(startState, action)

  expect(endState.todolists.length).toBe(1)
  expect(endState.todolists[0].id).toBe(todoListId2)
})

test('should be added correct todolist ', () => {
  let newTodolist = {
    id: todoListId1,
    title: 'Added todolist',
    filter: 'all',
    addedDate: '',
    order: 1,
  }

  const endState = todolistReducer(
    startState,
    addTodolistTC.fulfilled({ todolist: newTodolist }, '', 'requestId')
  )

  expect(endState.todolists.length).toBe(3)
  expect(endState.todolists[0].order).toBe(1)
  expect(endState.todolists.length).toBe(3)
})

test('should be change title todolist ', () => {
  const params: UpdateTodolistPayload = {
    todoListId: todoListId1,
    title: 'Change title',
    filter: 'all',
  }
  const endState = todolistReducer(startState, updateTodolistTC.fulfilled({ params }, '', params))

  expect(endState.todolists.length).toBe(2)
  expect(endState.todolists[1].title).toBe(params.title)
})

test('should be change filter todolist ', () => {
  const params: UpdateTodolistPayload = {
    todoListId: todoListId2,
    title: startState.todolists[1].title,
    filter: 'active',
  }
  const endState = todolistReducer(startState, updateTodolistTC.fulfilled({ params }, '', params))

  expect(endState.todolists.length).toBe(2)
  expect(endState.todolists[1].filter).toBe('active')
})

test('todolist should be set', () => {
  const endState = todolistReducer(
    { todolists: [] },
    setTodoListTC.fulfilled({ todoLists: startState.todolists }, 'requestId')
  )

  const keys = Object.keys(endState)

  expect(keys.length).toBe(2) //одно и тоже
  expect(endState.todolists.length).toBe(2) //
  expect(endState.todolists[1].id).toBe(todoListId2)
  expect(endState.todolists[0].id).toBe(todoListId1)
})

test('todolist entityStatus should be changed', () => {
  let newStatus: RequestStatusType = 'succeeded'
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
