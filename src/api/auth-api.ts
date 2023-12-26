//DAL level
//в api не должно быть ничего кроме axios
import { OperationResult } from "./tasks-api"
import { instance } from "./todolist-api"


export type RequestParamsType = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: boolean
}


export const authApi = {
  login(params: RequestParamsType) {
    return instance.post<OperationResult<{ userId: number }>>("/auth/login", params)
  },

  authMe() {
    return instance.post<OperationResult<{ id: number, email: string, login: string }>>("/auth/me")
  },

  logOut() {
    return instance.delete<OperationResult>("/auth/login")
  }
}