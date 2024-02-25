//DAL level
//в api не должно быть ничего кроме axios
import { instance } from "./todolist-api"
import { ResponseType } from "./todolist-api"


export type LoginParamsType = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: boolean
}


export const authApi = {
  login(params: LoginParamsType) {
    return instance.post<ResponseType<{ userId: number }>>("/auth/login", params)
  },

  authMe() { //проверочный запрос на cookie при инициализации app
    return instance.get<ResponseType<{ id: number, email: string, login: string }>>("/auth/me")
  },

  logOut() {
    return instance.delete<ResponseType>("/auth/login")
  }
}