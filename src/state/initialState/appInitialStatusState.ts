import { InitialStateType } from '../reducers/app/appSlice'

export const InitialStateApp: InitialStateType = {
  status: 'idle',
  error: null,
  success: null,
  initialized: false,
}
