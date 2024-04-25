import { tasksThunks } from '../tasksSlice/tasksSlice'
import { PayloadAction, createSlice, current } from '@reduxjs/toolkit'
import { clearTasksTodolists } from '../../actions/actions'
import { AppRootState } from 'BLL/store'
import { ResultCode } from 'common/emuns'
import { RequestStatus, TodolistApi, TodolistDomain, UpdateTodolistPayload } from 'common/types'
import { todolistApi } from 'DAL/todolist-api'
import { setStatusAppAC, setSuccessAppAC } from '../appSlice'
import {
  createAppAsyncThunk,
  handleServerAppError,
  handleServerNetworkError,
  thunkTryCatch,
} from 'common/utils'
import { AsyncThunkConfig } from '@reduxjs/toolkit/dist/createAsyncThunk'

const todolistSlice = createSlice({
  name: 'todolist',
  initialState: { todolists: [] as TodolistDomain[] }, //должен быть {} чтобы было удобство расширения
  reducers: {
    changeTodolistEntityStatusAC(
      state,
      action: PayloadAction<{ todoListId: string; entityStatus: RequestStatus }>
    ) {
      const index = state.todolists.findIndex((t) => t.id === action.payload.todoListId)
      if (index !== -1) state.todolists[index].entityStatus = action.payload.entityStatus
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setTodoListTC.fulfilled, (state, action) => {
        state.todolists = action.payload.todoLists.map((tl) => ({
          ...tl,
          filter: 'all',
          entityStatus: 'idle',
        }))
      })
      .addCase(addTodolistTC.fulfilled, (state, action) => {
        state.todolists.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
      })
      .addCase(removeTodolistTC.fulfilled, (state, action) => {
        const index = state.todolists.findIndex((t) => t.id === action.payload.todoListId)
        if (index !== -1) state.todolists.splice(index, 1)
      })
      .addCase(updateTodolistTC.fulfilled, (state, action) => {
        const index = state.todolists.findIndex((t) => t.id === action.payload?.todoListId)
        if (index !== -1) {
          state.todolists[index] = { ...state.todolists[index], ...action.payload }
        }
      })
      .addCase(clearTasksTodolists, (state, action) => {
        console.log('state/todolist', current(state))
        return { todolists: [] }
      })
  },
  selectors: {
    todolistsSelector: (state) => state.todolists,
  },
})

const setTodoListTC = createAppAsyncThunk<{ todoLists: TodolistApi[] }>(
  `${todolistSlice.name}/setTodoList`,
  (params, thunkAPI) => {
    const { dispatch } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistApi.getTodos()
      // dispatch(setTodoListAC({ todoLists: res.data }))
      dispatch(setStatusAppAC({ status: 'succeeded' }))
      res.data.map((tl) => {
        dispatch(tasksThunks.getTasksTC(tl.id))
      })
      return { todoLists: res.data }
    })
  }
)

const removeTodolistTC = createAppAsyncThunk<{ todoListId: string }, string>(
  `${todolistSlice.name}/removeTodoList`,
  (todoListId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    dispatch(changeTodolistEntityStatusAC({ todoListId, entityStatus: 'loading' })) //loader appeared
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistApi.deleteTodo(todoListId)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        // dispatch(removeTodolistAC({ todoListId }))
        dispatch(setSuccessAppAC({ success: 'todolist was successfully removed' }))
        dispatch(setStatusAppAC({ status: 'succeeded' }))
        return { todoListId }
      } else {
        handleServerAppError(res.data.messages, dispatch)
        return rejectWithValue(null)
      }
    })
  }
)

const addTodolistTC = createAppAsyncThunk<{ todolist: TodolistApi }, string>(
  `${todolistSlice.name}/addTodoList`,
  (title, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistApi.createTodo(title)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        // dispatch(addTodolistAC({ todolist: res.data.data.item }))
        dispatch(setSuccessAppAC({ success: 'todolist was successfully added' }))
        dispatch(setStatusAppAC({ status: 'succeeded' }))
        return { todolist: res.data.data.item }
      } else {
        handleServerAppError(res.data.messages, dispatch)
        return rejectWithValue(null)
      }
    })
  }
)

const updateTodolistTC = createAppAsyncThunk<UpdateTodolistPayload, UpdateTodolistPayload>(
  `${todolistSlice.name}/updateTodolist`,
  (params, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistApi.updateTodo(params.todoListId, params.title)
      if (res.data.resultCode === ResultCode.SUCCEEDED) {
        // dispatch(updateTodolistAC({ params }))
        dispatch(setSuccessAppAC({ success: 'todolist title was successfully updated' }))
        dispatch(setStatusAppAC({ status: 'succeeded' }))
        return params
      } else {
        handleServerAppError(res.data.messages, dispatch)
        return rejectWithValue(null)
      }
    })
  }
)

export const todolistReducer = todolistSlice.reducer
export const todolistsThunks = { setTodoListTC, removeTodolistTC, addTodolistTC, updateTodolistTC }
export const { changeTodolistEntityStatusAC } = todolistSlice.actions
export const todolistsSelectors = todolistSlice.getSelectors(
  (state: AppRootState) => state.todolists
)
