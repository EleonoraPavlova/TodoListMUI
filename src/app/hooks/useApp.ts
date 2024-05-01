import { createTheme } from '@mui/material'
import { lightGreen, lime } from '@mui/material/colors'
import { appThunks, initializedAppSelector } from 'BLL/reducers/appSlice'
import { isLoggedInSelector } from 'BLL/reducers/authSlice'
import { useActions } from 'common/hooks'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export function useApp() {
  let isLoggedIn = useSelector(isLoggedInSelector)
  let initialized = useSelector(initializedAppSelector)

  const { setInitializeAppTC } = useActions(appThunks)

  const navigate = useNavigate()

  useEffect(() => {
    // if (!demo) return
    setInitializeAppTC()
  }, [setInitializeAppTC])

  useEffect(() => {
    if (!isLoggedIn && initialized) {
      navigate('/login')
    } else {
      navigate('/')
    }
  }, [isLoggedIn, initialized, navigate])

  const toggleTheme = () => {
    setLightMode(!lightMode)
  }

  let [lightMode, setLightMode] = useState<boolean>(true) // change state theme
  let btnText = lightMode ? 'dark' : 'light'
  const themeHandler = createTheme({
    palette: {
      primary: lightGreen,
      secondary: lime,
      mode: lightMode ? 'light' : 'dark',
    },
  })

  return { btnText, toggleTheme, themeHandler }
}
