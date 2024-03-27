import { setErrorAppAC, setStatusAppAC } from 'app/BLL/reducers/appSlice'
import { Dispatch } from 'redux'

export const handleServerAppError = (messages: string[], dispatch: Dispatch) => {
  if (messages.length) {
    dispatch(setErrorAppAC({ error: messages[0] })) //приходит текст ошибки из сервера
  } else {
    dispatch(setErrorAppAC({ error: 'Some error occurred' })) //если не пришла из сервера, пишу вручную
  }
  dispatch(setStatusAppAC({ status: 'failed' }))
}
