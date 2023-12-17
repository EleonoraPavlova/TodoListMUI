import { Dispatch } from "redux"
import { ResponseTasksType } from "../api/tasks-api"
import { setErrorAppAC, setStatusAppAC } from "../state/reducers/app-reducer/app-reducer"

export const handleServerAppError = <D>(data: ResponseTasksType<D>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(setErrorAppAC(data.messages[0]))//вывод серверной ошибки
  } else {
    dispatch(setErrorAppAC("Some error occurred"))//если ошибка с сервера не пришла
  }
  dispatch(setStatusAppAC("failed"))
}


export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
  dispatch(setErrorAppAC(error.message ? error.message : "Some error occurred"))//вывод серверной ошибки
  dispatch(setStatusAppAC("failed"))
}