import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './App.css'
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'
import { createTheme, styled, ThemeProvider } from '@mui/material/styles'
import { lightGreen, lime } from '@mui/material/colors'
import MenuIcon from '@mui/icons-material/Menu'
import LinearProgress from '@mui/material/LinearProgress'
import { SnackBar } from '../components/SnackBar'
import { useNavigate } from 'react-router-dom'
import { authThunks, isLoggedInSelector } from 'BLL/reducers/authSlice'
import { appThunks, initializedAppSelector, statusAppSelector } from 'BLL/reducers/appSlice'
import { useActions } from 'common/hooks'
import { Routing } from 'features/routes/Routing'

type AppProps = {
  demo?: boolean
}

export const App: React.FC<AppProps> = ({ demo = false }) => {
  let status = useSelector(statusAppSelector)
  let isLoggedIn = useSelector(isLoggedInSelector)
  let initialized = useSelector(initializedAppSelector)
  const { setInitializeAppTC } = useActions(appThunks)
  const { logOutTC } = useActions(authThunks)

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

  let [lightMode, setLightMode] = useState<boolean>(true) // change state theme
  let btnText = lightMode ? 'dark' : 'light'
  const themeHandler = createTheme({
    palette: {
      primary: lightGreen,
      secondary: lime,
      mode: lightMode ? 'light' : 'dark',
    },
  })

  const toggleTheme = () => {
    setLightMode(!lightMode)
  }

  const logOutHandler = useCallback(() => {
    logOutTC()
  }, [isLoggedIn])

  const CustomCircularProgress = styled(CircularProgress)(({ theme }) => ({
    '& circle': {
      strokeWidth: 2,
      stroke: lime,
    },
  }))

  if (!initialized) {
    return (
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CustomCircularProgress />
      </Box>
    )
  }

  return (
    <ThemeProvider theme={themeHandler}>
      <CssBaseline />
      <SnackBar />
      <Box>
        <AppBar position="static">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <IconButton edge="start" color={'default'} aria-label="menu">
              <MenuIcon fontSize="large" />
            </IconButton>
            <Typography variant="h6" color={'white'}>
              TodoList
            </Typography>
            <Box>
              <Button
                variant="outlined"
                size="small"
                color={'inherit'}
                onClick={toggleTheme}
                sx={{ mr: '10px' }}>
                {btnText}
              </Button>
              {isLoggedIn && (
                <Button
                  variant="outlined"
                  size="small"
                  color={'secondary'}
                  onClick={logOutHandler}
                  sx={{ color: 'white' }}>
                  Log Out
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        {status === 'loading' && <LinearProgress />}
        <Container sx={{ marginTop: '25px' }}>
          <Box>
            <Routing />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
