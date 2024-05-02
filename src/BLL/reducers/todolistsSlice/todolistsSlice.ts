import { tasksThunks } from '../tasksSlice/tasksSlice'
import { PayloadAction, createSlice, current } from '@reduxjs/toolkit'
import { clearTasksTodolists } from '../../actions/actions'
import { AppRootState } from 'BLL/store'
import { ResultCode } from 'common/emuns'
import { RequestStatus, TodolistApi, TodolistDomain, UpdateTodolistPayload } from 'common/types'
import { todolistApi } from 'DAL/todolist-api'
import { setSuccessAppAC } from '../appSlice'
import { createAppAsyncThunk } from 'common/utils'

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
  async (_, { dispatch }) => {
    const res = await todolistApi.getTodos()
    res.data.map((tl) => {
      dispatch(tasksThunks.getTasksTC(tl.id))
    })
    return { todoLists: res.data }
  }
)

const removeTodolistTC = createAppAsyncThunk<{ todoListId: string }, string>(
  `${todolistSlice.name}/removeTodoList`,
  async (todoListId, { dispatch, rejectWithValue }) => {
    dispatch(changeTodolistEntityStatusAC({ todoListId, entityStatus: 'loading' })) //loader appeared
    const res = await todolistApi.deleteTodo(todoListId).finally(() => {
      dispatch(changeTodolistEntityStatusAC({ todoListId, entityStatus: 'idle' })) //undisable delete button
    })
    if (res.data.resultCode === ResultCode.SUCCEEDED) {
      dispatch(setSuccessAppAC({ success: 'todolist was successfully removed' }))
      return { todoListId }
    } else {
      return rejectWithValue(res.data)
    }
  }
)

const addTodolistTC = createAppAsyncThunk<{ todolist: TodolistApi }, string>(
  `${todolistSlice.name}/addTodoList`,
  async (title, { dispatch, rejectWithValue }) => {
    const res = await todolistApi.createTodo(title)
    if (res.data.resultCode === ResultCode.SUCCEEDED) {
      dispatch(setSuccessAppAC({ success: 'todolist was successfully added' }))
      return { todolist: res.data.data.item }
    } else {
      return rejectWithValue(res.data)
    }
  }
)

const updateTodolistTC = createAppAsyncThunk<UpdateTodolistPayload, UpdateTodolistPayload>(
  `${todolistSlice.name}/updateTodolist`,
  async (params, { dispatch, rejectWithValue }) => {
    const res = await todolistApi.updateTodo(params.todoListId, params.title)
    if (res.data.resultCode === ResultCode.SUCCEEDED) {
      dispatch(setSuccessAppAC({ success: 'todolist title was successfully updated' }))
      return params
    } else {
      return rejectWithValue(res.data)
    }
  }
)

export const todolistReducer = todolistSlice.reducer
export const todolistsThunks = { setTodoListTC, removeTodolistTC, addTodolistTC, updateTodolistTC }
export const { changeTodolistEntityStatusAC } = todolistSlice.actions
export const todolistsSelectors = todolistSlice.getSelectors(
  (state: AppRootState) => state.todolists
)
