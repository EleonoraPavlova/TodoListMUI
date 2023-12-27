import { Dispatch } from "redux"
import { OperationResult } from "../api/tasks-api"
import { setErrorAppAC, setStatusAppAC } from "../state/reducers/app/app-reducer"
import { AxiosError } from "axios"

export const handleServerAppError = <D>(data: OperationResult<D>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(setErrorAppAC(data.messages[0]))//вывод серверной ошибки
  } else {
    dispatch(setErrorAppAC("Some error occurred"))//если ошибка с сервера не пришла
  }
  dispatch(setStatusAppAC("failed"))
}


export const handleServerNetworkError = (err: { message: string }, dispatch: Dispatch) => {
  dispatch(setErrorAppAC(err.message ? err.message : "Some error! occurred"))//вывод серверной ошибки
  dispatch(setStatusAppAC("failed"))
}