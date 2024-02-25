import { Dispatch } from "redux"
import { ResponseType } from "../api/todolist-api"
import { setErrorAppAC, setStatusAppAC } from "../state/reducers/app/app-reducer"

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(setErrorAppAC({ error: data.messages[0] }))//вывод серверной ошибки
  } else {
    dispatch(setErrorAppAC({ error: "Some error occurred" }))//если ошибка с сервера не пришла
  }
  dispatch(setStatusAppAC({ status: "failed" }))
}


export const handleServerNetworkError = (err: { message: string }, dispatch: Dispatch) => {
  dispatch(setErrorAppAC({ error: err.message ? err.message : "Some error occurred" }))//вывод серверной ошибки
  dispatch(setStatusAppAC({ status: "failed" }))
}