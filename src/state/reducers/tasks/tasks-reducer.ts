import { AppDispatchType, AppRootStateType } from '../../store';
import { TasksStateType } from "../../../apps/App";
import { AddTodoListAction, RemoveTodoListAction, SetTodoListAction } from "../todolists/todolists-reducer";
import { tasksInitialState } from "../../initialState/tasksInitialState";
import { TaskPriorities, TaskStatuses, TaskTypeApi, UpdateTaskModelType, tasksApi } from "../../../api/tasks-api";
import { setErrorAppAC, setStatusAppAC } from "../app-reducer/app-reducer";

//АЛГОРИТМ редьюсер- функция кот хранит логику изменения state => возвращает измененый state
//1. Исходный state
//2. Объект для выполения действия со state
//2.1 Какой тип действия хотим выполнить
//2.2 Данные необходимые для этого действия - action


//пишем что нам нужно для выполения action, какие именно данные
export type TasksActionType =
  ReturnType<typeof RemoveTaskAC>
  | ReturnType<typeof AddTaskAC>
  | ReturnType<typeof ChangeTaskTitleAC>
  | ReturnType<typeof ChangeTaskStatusAC>
  | ReturnType<typeof SetTaskskAC>
  | ReturnType<typeof UpdateTaskAC>
  | SetTodoListAction
  | AddTodoListAction
  | RemoveTodoListAction


export type UpdateTaskModelTypeForAnyField = { //only for UpdateTaskTC
  title?: string
  description?: string
  completed?: boolean
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}

export const tasksReducer = (state: TasksStateType = {}, action: TasksActionType): TasksStateType => {
  switch (action.type) {
    case "REMOVE-TASK":
      return { ...state, [action.todoListsId]: state[action.todoListsId].filter(t => t.id !== action.id) };
    case "ADD-TASK":
      let copyState = { ...state }
      let tasks = copyState[action.task.todoListId]
      if (tasks) {
        const newTasks = [action.task, ...tasks]
        copyState[action.task.todoListId] = newTasks
        return copyState
      }
      return copyState
    case "CHANGE-TASK-TITLE":
      return { ...state, [action.todoListsId]: state[action.todoListsId]?.map(t => t.id === action.taskId ? { ...t, title: action.title } : t) }
    case "CHANGE-TASK-STATUS": {
      const copyState = { ...state }
      const tasks = copyState[action.todoListsId]
      if (tasks) {

        return { ...copyState, [action.todoListsId]: tasks.map(t => t.id === action.taskId ? { ...t, status: action.status } : t) }
      }
      return copyState
    }
    case "UPDATE-TASK":
      return { ...state, [action.todoListsId]: state[action.todoListsId].map((t) => t.id === action.taskId ? { ...t, ...action.model } : t) }
    case "ADD-TODOLIST":
      return { [action.todolist.id]: [], ...state }
    case "REMOVE-TODOLIST": {
      let copyState = { ...state }
      delete copyState[action.todoListsId] //delete property from {}
      return copyState
    }
    case "SET-TODOLIST": {
      const copyState = { ...state }
      action.todoLists.map(tl => copyState[tl.id] = [])//создаем свойство на основе тех листов,
      //которые прилетели с сервера - пробегаемся по каждому листу и  находим свойство id к которому добавляем - пустой массив
      return copyState
    }
    case "SET-TASKS": {
      return { ...state, [action.todoListsId]: action.tasks }//скопировала стейт,
      // нашла нужный todolist по приходящему action и установила tasks, которые прилетели с сервера
    }
    default: return state
  }
}

//функц action creator
export const RemoveTaskAC = (todoListsId: string, id: string) => {
  return {
    type: "REMOVE-TASK", todoListsId, id
  } as const //для явного указания типа литерала на основе конкретного значения 
}

export const AddTaskAC = (task: TaskTypeApi) => ({ type: "ADD-TASK", task } as const)


export const ChangeTaskStatusAC = (todoListsId: string, taskId: string, status: TaskStatuses) => {
  return {
    type: "CHANGE-TASK-STATUS",
    todoListsId, taskId, status
  } as const
}

export const ChangeTaskTitleAC = (todoListsId: string, taskId: string, title: string) => {
  return {
    type: "CHANGE-TASK-TITLE",
    todoListsId, taskId, title
  } as const
}

export const UpdateTaskAC = (todoListsId: string, taskId: string, model: UpdateTaskModelTypeForAnyField) => {
  return {
    type: "UPDATE-TASK",
    todoListsId, taskId, model
  } as const
}

export const SetTaskskAC = (todoListsId: string, tasks: TaskTypeApi[]) => {
  return {
    type: "SET-TASKS",
    todoListsId, tasks
  } as const
}


//thunks
export const SetTasksTC = (todoListsId: string) => (dispatch: AppDispatchType) => {
  dispatch(setStatusAppAC("loading"))
  tasksApi.getTasks(todoListsId)
    .then(res => {
      dispatch(SetTaskskAC(todoListsId, res.data.items))
      dispatch(setStatusAppAC("succeeded"))
    })
}


export const RemoveTaskTC = (todoListsId: string, taskId: string) => (dispatch: AppDispatchType) => {
  //dispatch - функция, которая используется для отправки действий в хранилище Redux.
  dispatch(setStatusAppAC("loading"))
  tasksApi.deleteTasks(todoListsId, taskId)
    .then(res => {
      dispatch(RemoveTaskAC(todoListsId, taskId))
      dispatch(setStatusAppAC("succeeded"))
    })
}


export const AddTaskTC = (title: string, todoListsId: string) => (dispatch: AppDispatchType) => {
  //Для чего нужна функция dispatch санке ? Чтобы изменять state
  dispatch(setStatusAppAC("loading"))
  tasksApi.createTasks(todoListsId, title)
    .then(res => {
      if (res.data.resultCode === 0) {
        const task = res.data.data.item
        dispatch(AddTaskAC(task))
        dispatch(setStatusAppAC("succeeded"))
        //тут добавить notification success
      } else {
        if (res.data.messages.length) {
          dispatch(setErrorAppAC(res.data.messages[0]))//вывод серверной ошибки
        } else {
          dispatch(setErrorAppAC("Some error occurred"))//если ошибка с сервера не пришла
        }
        dispatch(setStatusAppAC("failed"))
      }
    })
}


//update any field
export const UpdateTaskTC = (todoListsId: string, taskId: string, model: UpdateTaskModelTypeForAnyField) =>
  (dispatch: AppDispatchType, getState: () => AppRootStateType) => { //Для чего нужна функция dispatch санке? Чтобы изменять state
    const state = getState()
    const task = state.tasks[todoListsId].find(t => t.id === taskId) //нашли нужную таску в state и меняю поля которые необходимо

    if (!task) {
      console.warn("Task was not found")
      return
    }
    const apiModel: UpdateTaskModelType = {
      title: task.title,
      description: task.description,
      completed: task.completed,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      ...model //перезатираю теми соападающими полями, которые приходят с UpdateTaskTC
    }
    dispatch(setStatusAppAC("loading"))
    tasksApi.updateTasks(todoListsId, taskId, apiModel)
      .then(res => {
        dispatch(UpdateTaskAC(todoListsId, taskId, apiModel))
        dispatch(setStatusAppAC("succeeded"))
      })
  }

//export const ChangeTaskTitleTC = (todoListsId: string, taskId: string, title: string) => {
// return (dispatch: Dispatch) => {
//   tasksApi.updateTasks(todoListsId, taskId, title)
//     .then(res => {
//       const action = ChangeTaskTitleAC(todoListsId, taskId, title)
//       dispatch(action)
//     })
// }
//}

// export const ChangeTaskStatusTC = (todoListsId: string, taskId: string, status: TaskStatuses) => {
//   return (dispatch: Dispatch, getState: () => AppRootStateType) => { //Для чего нужна функция dispatch санке ? Чтобы изменять state
//     const state = getState()
//     const task = state.tasks[todoListsId].find(t => t.id === taskId) //нашли нужную таску в state и меняю поля которые необходимо
//     if (!task) {
//       console.warn("Task was not found")
//       return
//     }
//     const model: UpdateTaskModelType = {
//       title: task.title,
//       description: task.description,
//       completed: task.completed,
//       status: status,
//       priority: task.priority,
//       startDate: task.startDate,
//       deadline: task.deadline,
//     }
//     tasksApi.updateTasks(todoListsId, taskId, model)
//       .then(res => {
//         const action = ChangeTaskStatusAC(todoListsId, taskId, status)
//         debugger
//         dispatch(action)
//       })
//   }
// }