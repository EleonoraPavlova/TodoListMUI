import { createSlice, current } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { clearTasksTodolists } from '../../actions/actions'
import { AppRootState } from 'BLL/store'
import { todolistsThunks } from '../todolistsSlice'
import { ResultCode, TaskStatuses } from 'common/emuns'
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from 'common/utils'
import { tasksInitial } from 'BLL/initialState'
import { setStatusAppAC, setSuccessAppAC } from '../appSlice'
import { tasksApi } from 'DAL/tasks-api'
import { DeleteParamsTask, Task, UpdateParamsTask, UpdateTaskModel } from 'common/types'
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk'

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: tasksInitial,
  reducers: {},
  extraReducers: (builder) => {
    //для обработки чужих reducer, и состояний санок(по типу getTasksTC.fulfilled)
    //extraReducers НЕ СОЗДАЕТ actions creators, он использует с другой логикой редьюсер с таким же названием
    builder
      .addCase(getTasksTC.fulfilled, (state, action) => {
        state[action.payload.todoListId] = action.payload.tasks
      })
      .addCase(removeTaskTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.todoListId]
        const index = tasks.findIndex((t: Task) => t.id === action.payload.taskId)
        if (index !== -1) tasks.splice(index, 1)
      })
      .addCase(addTaskTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.task.todoListId]
        tasks.unshift(action.payload.task)
      })
      .addCase(updateTaskTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.todoListId]
        const index = tasks.findIndex((t: Task) => t.id === action.payload.taskId)
        if (index !== -1) tasks[index] = { ...tasks[index], ...action.payload.model }
      })
      .addCase(todolistsThunks.addTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(todolistsThunks.removeTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.todoListId] //delete property from {}
      })
      .addCase(todolistsThunks.setTodoListTC.fulfilled, (state, action) => {
        delete state['todoListId1']
        delete state['todoListId2']
        action.payload.todoLists.map((tl) => (state[tl.id] = []))
      })
      .addCase(clearTasksTodolists, (state, action) => {
        console.log('state/tasks', current(state))
        return {}
      })
  },
  selectors: {
    tasksSelector: (slice) => slice.tasks,
  },
})

const getTasksTC = createAppAsyncThunk<
  { todoListId: string; tasks: Task[] },
  string,
  AsyncThunkConfig
>(`${tasksSlice.name}/getTasks`, async (todoListId, { dispatch, rejectWithValue }) => {
  dispatch(setStatusAppAC({ status: 'loading' }))
  try {
    const res = await tasksApi.getTasks(todoListId)
    // dispatch(setTaskskAC({ todoListId, tasks: res.data.items }))
    dispatch(setStatusAppAC({ status: 'succeeded' }))
    return { todoListId, tasks: res.data.items }
  } catch (err) {
    const error: AxiosError = err as AxiosError
    handleServerNetworkError(err as { message: string }, dispatch)
    return rejectWithValue({ errors: [error.message], fieldsErrors: undefined })
  }
})

const removeTaskTC = createAppAsyncThunk<DeleteParamsTask, DeleteParamsTask, AsyncThunkConfig>(
  `${tasksSlice.name}/removeTask`,
  async (params, { dispatch, rejectWithValue }) => {
    const { todoListId, taskId } = params
    dispatch(setStatusAppAC({ status: 'loading' }))
    dispatch(updateTaskTC({ todoListId, taskId, model: { status: TaskStatuses.inProgress } }))
    try {
      const res = await tasksApi.deleteTask(params)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        // thunkApi.dispatch(removeTaskAC( todoListId, taskId ))
        dispatch(setSuccessAppAC({ success: 'task was successfully removed' }))
        dispatch(setStatusAppAC({ status: 'succeeded' }))
        return params
      } else {
        handleServerAppError(res.data.messages, dispatch)
        return rejectWithValue(null)
      }
    } catch (err) {
      const error: AxiosError = err as AxiosError
      handleServerNetworkError(err as { message: string }, dispatch)
      return rejectWithValue({ errors: [error.message], fieldsErrors: undefined })
    }
  }
)

const addTaskTC = createAppAsyncThunk<{ task: Task }, { title: string; todoListId: string }>(
  `${tasksSlice.name}/addTask`,
  async ({ title, todoListId }, { dispatch, rejectWithValue }) => {
    dispatch(setStatusAppAC({ status: 'loading' }))
    try {
      const res = await tasksApi.createTasks(todoListId, title)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        const task = res.data.data.item
        // thunkApi.dispatch(addTaskAC({ task }))
        dispatch(setSuccessAppAC({ success: 'task was successfully added' }))
        dispatch(setStatusAppAC({ status: 'succeeded' }))
        return { task }
      } else {
        handleServerAppError(res.data.messages, dispatch)
        return rejectWithValue(null)
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      return rejectWithValue(null)
    }
  }
)

//update any field
const updateTaskTC = createAppAsyncThunk<UpdateParamsTask, UpdateParamsTask, AsyncThunkConfig>(
  `${tasksSlice.name}/updateTask`,
  async (params, { dispatch, rejectWithValue, getState }) => {
    const { todoListId, taskId, model } = params
    const state = getState() as AppRootState
    const task = state.tasks[todoListId].find((t: Task) => t.id === taskId) //нашли нужную таску в state и меняю поля которые необходимо

    if (!task) return rejectWithValue('mistake')

    const apiModel: UpdateTaskModel = {
      title: task.title,
      description: task.description,
      completed: task.completed,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      ...model,
    }
    dispatch(setStatusAppAC({ status: 'loading' }))
    try {
      const res = await tasksApi.updateTask({ todoListId, taskId, model: apiModel })
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        // dispatch(updateTaskAC({ todoListId, taskId, model: apiModel }))
        dispatch(setSuccessAppAC({ success: 'task was successfully updated' }))
        dispatch(setStatusAppAC({ status: 'succeeded' }))
        return params
      } else {
        handleServerAppError(res.data.messages, dispatch)
        return rejectWithValue(null)
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch)
      return rejectWithValue(null)
    }
  }
)

export const tasksReducer = tasksSlice.reducer
export const tasksThunks = { addTaskTC, updateTaskTC, removeTaskTC, getTasksTC }
export const { tasksSelector } = tasksSlice.selectors
export const {} = tasksSlice.actions
