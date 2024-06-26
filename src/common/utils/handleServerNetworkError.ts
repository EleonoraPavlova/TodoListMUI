import { isAxiosError } from 'axios'
import { setErrorAppAC } from 'BLL/reducers/appSlice'
import { Dispatch } from 'redux'

//server crashed
export const handleServerNetworkError = (err: unknown, dispatch: Dispatch): void => {
  let errorMessage = 'Some error occurred'
  if (isAxiosError(err)) {
    errorMessage = err.response?.data?.message || err?.message || errorMessage
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`
  } else {
    errorMessage = JSON.stringify(err)
  }

  dispatch(setErrorAppAC({ error: errorMessage }))
}
