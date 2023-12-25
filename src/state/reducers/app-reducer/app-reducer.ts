export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed' //статус взаимодействия с сервером


export type InitialStateType = {
  status: RequestStatusType,
  error: string | null, //текст приходящей ошибки
  success: string | null
}

export type SetErrorApp = ReturnType<typeof setErrorAppAC>
export type SetStatusApp = ReturnType<typeof setStatusAppAC>
export type setSuccessApp = ReturnType<typeof setSuccessAppAC>

export type ActionType = SetErrorApp | SetStatusApp | setSuccessApp


export let InitialState: InitialStateType = {
  status: 'idle', //'idle'  - еще запроса не было - for loader App, меняется при каждом запросе на сервер!
  error: null, //нет никакой ошибки изначально //меняется при каждом запросе на сервер!
  success: null
}

export const appReducer = (state: InitialStateType = InitialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case "SET-APP-ERROR":
      return { ...state, error: action.error }
    case "SET-APP-STATUS":
      return { ...state, status: action.status }
    case "SET-APP-SUCCESS":
      return { ...state, success: action.success }
    default: return { ...state }
  }
}

//action creator
export const setErrorAppAC = (error: string | null) => {
  return { type: "SET-APP-ERROR", error } as const
}

export const setStatusAppAC = (status: RequestStatusType) => {
  return { type: "SET-APP-STATUS", status } as const
}
export const setSuccessAppAC = (success: string | null) => {
  return { type: "SET-APP-SUCCESS", success } as const
}