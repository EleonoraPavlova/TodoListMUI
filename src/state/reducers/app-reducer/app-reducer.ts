export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed' //статус взаимодействия с сервером


export type InitialStateType = {
  status: RequestStatusType,
  error: string | null //текст приходящей ошибки
}

export type SetErrorApp = ReturnType<typeof setErrorAppAC>
export type SetStatusApp = ReturnType<typeof setStatusAppAC>

export type ActionType = SetErrorApp | SetStatusApp


export let InitialState: InitialStateType = {
  status: 'idle', //'idle'  - еще запроса не было - for loader App, меняется при каждом запросе на сервер!
  error: null //нет никакой ошибки изначально //меняется при каждом запросе на сервер!
}

export const appReducer = (state: InitialStateType = InitialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case "SET-APP-ERROR":
      return { ...state, error: action.error }
    case "SET-APP-STATUS":
      return { ...state, status: action.status }
    default: return { ...state }
  }
}

//action creator
export const setErrorAppAC = (error: string | null) => {
  return {
    type: "SET-APP-ERROR",
    error
  } as const
}

export const setStatusAppAC = (status: RequestStatusType) => {
  return {
    type: "SET-APP-STATUS",
    status
  } as const
}