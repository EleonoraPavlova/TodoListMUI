import { initializedAppSelector } from 'BLL/reducers/appSlice'
import { isLoggedInSelector } from 'BLL/reducers/authSlice'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

type Props = {
  children: React.ReactNode
  redirectTo: string
}

export const PrivateRoute: React.FC<Props> = ({ children, redirectTo }) => {
  const isLoggedIn = useSelector(isLoggedInSelector)
  const initialized = useSelector(initializedAppSelector)

  if (isLoggedIn && initialized) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}
