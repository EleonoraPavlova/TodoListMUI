import { TodolistTypeApi, todolistApi } from "../../../api/todolist-api";
import { RequestStatusType, setStatusAppAC, setSuccessAppAC } from "../app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "../../../utils/error-utils";
import { ResultCode, getTasksTC } from "../tasks/tasks-reducer";
import { PayloadAction, createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { ClearTasksTodolistsType, clearTasksTodolists } from "../../../actions/actions";

//АЛГОРИТМ
//1. Исходный state
//2. Объект для выполения действия со state
//2.1 Какой тип действия хотим выполнить
//2.2 Данные необходимые для этого действия - action

export type FilterValuesType = "all" | "active" | "completed"

export type TodolistDomainTypeApi = TodolistTypeApi & { //расширяю тип который приходить с backend
  filter: FilterValuesType,
  entityStatus: RequestStatusType
}
export type UpdateTodolistPayload = {
  todoListId: string;
  title: string;
  filter: FilterValuesType;
};

const initialState: TodolistDomainTypeApi[] = []


export const setTodoListTC = createAsyncThunk('todolist/setTodoList', async (params, { dispatch, rejectWithValue }) => {
  dispatch(setStatusAppAC({ status: "loading" }))
  try {
    const res = await todolistApi.getTodos()
    // dispatch(setTodoListAC({ todoLists: res.data }))
    dispatch(setStatusAppAC({ status: "succeeded" }))
    res.data.map(tl => {
      dispatch(getTasksTC(tl.id))
    })
    return { todoLists: res.data }
  } catch (err) {
    handleServerNetworkError(err as { message: string }, dispatch)
    return rejectWithValue(null)
  }
})

export const removeTodolistTC = createAsyncThunk('todolist/removeTodoList', async (todoListId: string, { dispatch, rejectWithValue }) => {
  dispatch(setStatusAppAC({ status: "loading" }))
  dispatch(changeTodolistEntityStatusAC({ todoListId, entityStatus: "loading" }))//loader appeared
  try {
    const res = await todolistApi.deleteTodo(todoListId)
    if (res.data.resultCode === ResultCode.SUCCEEDED) {
      // dispatch(removeTodolistAC({ todoListId }))
      dispatch(setSuccessAppAC({ success: "todolist was successfully removed" }))
      dispatch(setStatusAppAC({ status: "succeeded" }))
      return { todoListId }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (err) {
    handleServerNetworkError(err as { message: string }, dispatch)
    return rejectWithValue(null)
  }
})

export const addTodolistTC = createAsyncThunk('todolist/addTodoList', async (title: string, { dispatch, rejectWithValue }) => {
  dispatch(setStatusAppAC({ status: "loading" }))
  try {
    const res = await todolistApi.createTodo(title)
    if (res.data.resultCode === ResultCode.SUCCEEDED) {
      // dispatch(addTodolistAC({ todolist: res.data.data.item }))
      dispatch(setSuccessAppAC({ success: "todolist was successfully added" }))
      dispatch(setStatusAppAC({ status: "succeeded" }))
      return { todolist: res.data.data.item }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (err) {
    handleServerNetworkError(err as { message: string }, dispatch)
    return rejectWithValue(null)
  }
})

export const updateTodolistTC = createAsyncThunk('todolist/updateTodolist', async (params: UpdateTodolistPayload, { dispatch, rejectWithValue }) => {
  dispatch(setStatusAppAC({ status: "loading" }))
  try {
    const res = await todolistApi.updateTodo(params.todoListId, params.title)
    if (res.data.resultCode === ResultCode.SUCCEEDED) {
      // dispatch(updateTodolistAC({ params }))
      dispatch(setSuccessAppAC({ success: "todolist title was successfully updated" }))
      dispatch(setStatusAppAC({ status: "succeeded" }))
      return { params }
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (err) {
    handleServerNetworkError(err as { message: string }, dispatch)
    return rejectWithValue(null)
  }
})

const slice = createSlice({
  name: "todolist",
  initialState: initialState,
  reducers: {
    // removeTodolistAC(state, action: PayloadAction<{ todoListId: string }>) {
    //   const index = state.findIndex(t => t.id === action.payload.todoListId)
    //   if (index !== - 1) state.splice(index, 1)
    // },
    // addTodolistAC(state, action: PayloadAction<{ todolist: TodolistTypeApi }>) {
    //   state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
    // },
    // updateTodolistAC(state, action: PayloadAction<{ params: UpdateTodolistPayload }>) {
    //   const index = state.findIndex(t => t.id === action.payload.params.todoListId)
    //   if (index !== - 1) state[index] = { ...state[index], ...action.payload.params }
    //   //объединить существующий элементы массива со значениями из action.payload.params
    // },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ todoListId: string, entityStatus: RequestStatusType }>) {
      const index = state.findIndex(t => t.id === action.payload.todoListId)
      if (index !== - 1) state[index].entityStatus = action.payload.entityStatus
    },
    // setTodoListAC(state, action: PayloadAction<{ todoLists: TodolistTypeApi[] }>) {
    //   return action.payload.todoLists.map(tl => ({ ...tl, filter: "all", entityStatus: "idle" }))
    // },
    // clearTodoListAC() {
    //   return []
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(setTodoListTC.fulfilled, (state, action) => {
        return action.payload.todoLists.map(tl => ({ ...tl, filter: "all", entityStatus: "idle" }))
      })
      .addCase(addTodolistTC.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
      })
      .addCase(removeTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex(t => t.id === action.payload.todoListId)
        if (index !== - 1) state.splice(index, 1)
      })
      .addCase(updateTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex(t => t.id === action.payload?.params.todoListId)
        if (index !== - 1) state[index] = { ...state[index], ...action.payload?.params }
        //объединить существующий элементы массива со значениями из action.payload.params
      })
      .addCase(clearTasksTodolists, (state, action) => {
        console.log("state/todolist", current(state))
        return []
      })
  }
})

export const todolistReducer = slice.reducer
export const { changeTodolistEntityStatusAC } = slice.actions