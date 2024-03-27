import { LoginParams, ResponseBase } from 'common/types'
import { instance } from './instance'

export const authApi = {
  login(params: LoginParams) {
    return instance.post<ResponseBase<{ userId: number }>>('/auth/login', params)
  },

  authMe() {
    //проверочный запрос на cookie при инициализации app
    return instance.get<ResponseBase<{ id: number; email: string; login: string }>>('/auth/me')
  },

  logOut() {
    return instance.delete<ResponseBase>('/auth/login')
  },
}
