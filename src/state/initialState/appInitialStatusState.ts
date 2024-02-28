import { InitialStateType } from '../reducers/app/app-reducer'

export const InitialStateApp: InitialStateType = {
  status: 'idle',
  error: null,
  success: null,
  initialized: false,
}
