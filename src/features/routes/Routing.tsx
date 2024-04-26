import { TodoListsForRender } from 'components/TodolistRender'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import { Login } from 'features/pages/Login'

export const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<TodoListsForRender />} />
      <Route
        path="login"
        element={
          <PrivateRoute redirectTo="/">
            <Login />
          </PrivateRoute>
        }
      />
      <Route path="404" element={<h1>404: PAGE NOT FOUND</h1>} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  )
}
