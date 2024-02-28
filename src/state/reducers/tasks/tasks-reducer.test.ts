import { addTaskTC, getTasksTC, removeTaskTC, tasksReducer, updateTaskTC } from './tasks-reducer'
import { TasksStateType } from '../../../apps/App'
import { addTodolistTC, setTodoListTC } from '../todolists/todolists-reducer'
import { tasksInitialState } from '../../initialState/tasksInitialState'
import { todoListId1, todoListId2 } from '../../initialState/idState'
import {
  TaskPriorities,
  TaskStatuses,
  TaskTypeApi,
  UpdateTaskModelType,
} from '../../../api/tasks-api'
import { v1 } from 'uuid'

let startState: TasksStateType

beforeEach(() => {
  //Выполняет функцию перед выполнением тестов в текущем файле
  startState = tasksInitialState
})

test('correct task should be deleted from correct array', () => {
  const payload = { todoListId: todoListId2, taskId: startState[todoListId2][0].id }
  const action = removeTaskTC.fulfilled(payload, 'requestId', payload)

  const endState = tasksReducer(startState, action)

  expect(endState[todoListId2][0].title).toBe('Water')
})

test('correct task should be added to correct array', () => {
  const task: TaskTypeApi = {
    id: v1(),
    title: 'Juice',
    description: '',
    completed: false,
    status: TaskStatuses.New,
    priority: TaskPriorities.Low,
    startDate: '',
    deadline: '',
    todoListId: todoListId1,
    order: 1,
    addedDate: '',
  }
  const action = addTaskTC.fulfilled({ task }, 'requestId', {
    title: task.title,
    todoListId: task.todoListId,
  })

  const endState = tasksReducer(startState, action)

  expect(endState[todoListId1].length).toBe(6)
  expect(endState[todoListId1][0].title).toBe('Juice')
  expect(endState[todoListId1][1].title).toBe('HTML&CSS')
  expect(endState[todoListId1][0].status).toBe(TaskStatuses.New)
})

test('status of specified task should be changed', () => {
  const payload = {
    todoListId: todoListId2,
    taskId: startState[todoListId2][1].id,
    model: { ...startState[todoListId2][1], status: TaskStatuses.New },
  }
  const action = updateTaskTC.fulfilled(payload, '', payload)

  const endState = tasksReducer(startState, action)

  expect(endState[todoListId2][1].status).toBe(TaskStatuses.New)
  expect(startState[todoListId2][1].status).toBe(TaskStatuses.Completed)
})

test('title of specified task should be changed', () => {
  const model: UpdateTaskModelType = {
    title: 'Potatos',
    description: '',
    completed: true,
    status: TaskStatuses.Completed,
    priority: 1,
    startDate: '',
    deadline: '',
  }

  const payload = { todoListId: todoListId2, taskId: startState[todoListId2][1].id, model }
  const action = updateTaskTC.fulfilled(payload, 'requestId', payload)

  const endState = tasksReducer(startState, action)

  expect(endState[todoListId2][1].title).toBe('Potatos')
  expect(startState[todoListId2][1].title).toBe('Water')
})

test('new array should be added when new todolist is added', () => {
  let newTodolist = {
    id: 'todoListId1',
    title: 'Added todolist',
    filter: 'all',
    addedDate: '',
    order: 1,
  }
  const action = addTodolistTC.fulfilled({ todolist: newTodolist }, '', 'requestId')
  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)

  const newKey = keys.find(k => k != todoListId1 && k != todoListId2)
  if (!newKey) {
    throw Error('new key should be added')
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test('tasks should be added for todolist', () => {
  const action = getTasksTC.fulfilled(
    { todoListId: todoListId1, tasks: startState[todoListId1] },
    'requestId',
    'todoListId1'
  )
  const endState = tasksReducer(
    {
      [todoListId1]: [],
      [todoListId2]: [],
    },
    action
  )

  expect(endState[todoListId1].length).toBe(5) //положили в пустой todoListId1 таски 4 шт
  expect(endState[todoListId2].length).toBe(0) //ничего не положили в пустой todoListId2 таски
})

test('empty todolist should be added wnen we set todolists', () => {
  const todolist = {
    id: '1',
    addedDate: '',
    order: 1,
    title: 'Title',
  }
  const action = setTodoListTC.fulfilled({ todoLists: [todolist] }, 'requestId')
  const endState = tasksReducer(
    {
      [todoListId1]: [],
      [todoListId2]: [],
    },
    action
  )

  expect(endState['1'].length).toBe(1)
  expect(endState['1']).toBeDefined()
})
