import React, { useCallback, useEffect, useState } from 'react'
import { Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './App.css'
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'
import { createTheme, styled, ThemeProvider } from '@mui/material/styles'
import { lightGreen, lime } from '@mui/material/colors'
import MenuIcon from '@mui/icons-material/Menu'
import { useAppDispatch } from '../common/hooks/hooks-selectors'
import LinearProgress from '@mui/material/LinearProgress'
import { SnackBar } from '../components/SnackBar'
import { Navigate, Routes, useNavigate } from 'react-router-dom'
import { authThunks, isLoggedInSelector } from 'BLL/reducers/authSlice'
import { Login } from 'features/pages/Login'
import { TodoListsForRender } from 'components/TodolistRender'
import { appThunks, initializedAppSelector, statusAppSelector } from 'BLL/reducers/appSlice'

type AppProps = {
  demo?: boolean
}

export const App: React.FC<AppProps> = ({ demo = false }) => {
  let status = useSelector(statusAppSelector)
  let isLoggedIn = useSelector(isLoggedInSelector)
  let initialized = useSelector(initializedAppSelector)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    // if (!demo) return
    dispatch(appThunks.setInitializeAppTC())
  }, [dispatch])

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
    dispatch(authThunks.logOutTC())
  }, [isLoggedIn])

  // <CssBaseline /> - обеспечивает максимальное применение стилей из библиотеки

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
          <Grid
            container
            sx={{
              p: '10px',
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: '40px',
              flexWrap: 'wrap',
            }}>
            <Routes>
              <Route path="/" element={<TodoListsForRender demo={demo} />} />
              <Route
                path="login"
                element={isLoggedIn && initialized ? <Navigate to="/" /> : <Login />}
              />
              <Route path="404" element={<h1>404: PAGE NOT FOUND</h1>} />
              <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
