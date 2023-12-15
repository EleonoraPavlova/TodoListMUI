import { TodolistTypeApi, todolistApi } from "../../../api/todolist-api";
import { RequestStatusType, setStatusAppAC } from "../app-reducer/app-reducer";
import { AppDispatchType } from "../../store";


//АЛГОРИТМ
//1. Исходный state
//2. Объект для выполения действия со state
//2.1 Какой тип действия хотим выполнить
//2.2 Данные необходимые для этого действия - action

export type SetTodoListAction = ReturnType<typeof SetTodoListAC>
export type AddTodoListAction = ReturnType<typeof AddTodolistAC>
export type RemoveTodoListAction = ReturnType<typeof RemoveTodolistAC>

//пишем что нам нужно для выполения action, какие именно данные
export type ActionTypeTodolist =
  | ReturnType<typeof ChangeTodoListTitleAC>
  | ReturnType<typeof ChangeTodoListFilterAC>
  | SetTodoListAction
  | AddTodoListAction
  | RemoveTodoListAction


export let initialStateTodolist: TodolistDomainTypeApi[] = [];
export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainTypeApi = TodolistTypeApi & { //расширяю тип который приходить с backend
  filter: FilterValuesType,
  entityStatus: RequestStatusType
}

export const todolistReducer = (state: TodolistDomainTypeApi[] = initialStateTodolist, action: ActionTypeTodolist): TodolistDomainTypeApi[] => {
  switch (action.type) {
    case "REMOVE-TODOLIST":
      return state.filter(l => l.id !== action.todoListsId);
    case "ADD-TODOLIST":
      //cкопировала пришедший todolist и добавила недостающий filter
      return [{ ...action.todolist, filter: "all", entityStatus: "idle" }, ...state]; //работает как  setTodoLists([newTodoId, ...todoLists])
    case "CNAHGE-TODOLIST-TITLE":
      return state.map(t => t.id === action.todoListsId ? { ...t, title: action.title } : t)
    case "CNAHGE-TODOLIST-FILTER":
      return state.map(t => t.id === action.todoListsId ? { ...t, filter: action.filter } : t)
    case "SET-TODOLIST": //установка todolistis, только пришедших с сервера и установка их в изначально пустой массив
      return action.todoLists.map(tl => ({ ...tl, filter: "all", entityStatus: "idle" })) //добавила каждому листу недостающий фильтр
    default: return state
  }
}

//action creator
export const RemoveTodolistAC = (todoListsId: string) => {
  return {
    type: "REMOVE-TODOLIST", todoListsId
  } as const
}

export const AddTodolistAC = (todolist: TodolistTypeApi) => ({ type: "ADD-TODOLIST", todolist } as const)


export const ChangeTodoListTitleAC = (todoListsId: string, title: string) => {
  return {
    type: "CNAHGE-TODOLIST-TITLE", title, todoListsId
  } as const
}

export const ChangeTodoListFilterAC = (todoListsId: string, title: string, filter: FilterValuesType) => {
  return {
    type: "CNAHGE-TODOLIST-FILTER",
    todoListsId, title, filter
  } as const
}

export const SetTodoListAC = (todoLists: TodolistTypeApi[]) => { //установить todolist, который пришел с сервера
  return {
    type: "SET-TODOLIST", todoLists
  } as const
}

//thunks
export const SetTodoListTC = () => (dispatch: AppDispatchType) => {
  dispatch(setStatusAppAC("loading"))
  todolistApi.getTodo()
    .then(res => {
      dispatch(SetTodoListAC(res.data))
      dispatch(setStatusAppAC("succeeded"))
    })
}

export const RemoveTodolistTC = (todolistId: string) => (dispatch: AppDispatchType) => {
  dispatch(setStatusAppAC("loading"))
  todolistApi.deleteTodo(todolistId)
    .then(res => {
      dispatch(RemoveTodolistAC(todolistId))
      dispatch(setStatusAppAC("succeeded"))
    })

}

export const AddTodolistTC = (title: string) => (dispatch: AppDispatchType) => {
  dispatch(setStatusAppAC("loading"))
  todolistApi.createTodo(title)
    .then(res => {
      dispatch(AddTodolistAC(res.data.data.item))
      dispatch(setStatusAppAC("succeeded"))
    })
    .catch((e) => {
      // dispatch(setErrorAppAC(e.message))
    }
    )
}


export const ChangeTodoListTitleTC = (todolistId: string, title: string) => (dispatch: AppDispatchType) => {
  dispatch(setStatusAppAC("loading"))
  todolistApi.updateTodo(todolistId, title)
    .then(res => {
      dispatch(ChangeTodoListTitleAC(todolistId, title))
      dispatch(setStatusAppAC("succeeded"))
    })
}


export const ChangeTodoListFilterTC = (todolistId: string, title: string, filter: FilterValuesType) =>
  (dispatch: AppDispatchType) => {
    dispatch(setStatusAppAC("loading"))
    todolistApi.updateTodo(todolistId, title)
      .then(res => {
        dispatch(ChangeTodoListFilterAC(todolistId, title, filter))
        dispatch(setStatusAppAC("succeeded"))
      })
  }