import { AppInitialState } from 'common/types'

export const appInitial: AppInitialState = {
  status: 'idle', //'idle'  - еще запроса не было - for loader App, меняется при каждом запросе на сервер!
  error: null, //нет никакой ошибки изначально //меняется при каждом запросе на сервер!
  success: null,
  initialized: false, //(проверка куки, настроек пользователя)
}
