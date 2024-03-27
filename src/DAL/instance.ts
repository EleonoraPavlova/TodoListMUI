import axios from 'axios'

export const instance = axios.create({
  withCredentials: true,
  //чтобы цеплялась кука к запросу(чтобы распознать пользователя авторизован или нет)
  baseURL: 'https://social-network.samuraijs.com/api/1.1',
  headers: {
    'API-KEY': '6a891b51-a742-4c47-8da1-58a8df99feb7',
  },
})
