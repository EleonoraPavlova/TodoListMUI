import { setErrorAppAC, setStatusAppAC } from 'BLL/reducers/appSlice'
import { Dispatch } from 'redux'

/**
 * This function handles ThunkErrorApiConfig that may occur when interacting with the server.
 * @param messages - arr of string
 * @param dispatch - function for sending messages to the Redux store
 * @param showError - flag indicating whether ThunkErrorApiConfig should be shown in the user interface
 */

export const handleServerAppError = (
  messages: string[],
  dispatch: Dispatch,
  showError: boolean = true
) => {
  if (showError) {
    dispatch(
      setErrorAppAC(messages.length ? { error: messages[0] } : { error: 'Some error occurred' })
    )
  }
  dispatch(setStatusAppAC({ status: 'failed' }))
}
