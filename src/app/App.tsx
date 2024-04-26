import React from 'react'
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
import { ThemeProvider, styled } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import LinearProgress from '@mui/material/LinearProgress'
import { SnackBar } from '../components/SnackBar'
import { isLoggedInSelector } from 'BLL/reducers/authSlice'
import { initializedAppSelector, statusAppSelector } from 'BLL/reducers/appSlice'
import { Routing } from 'features/routes/Routing'
import { useApp } from './hooks/useApp'
import { lime } from '@mui/material/colors'

type AppProps = {
  demo?: boolean
}

export const App: React.FC<AppProps> = ({ demo = false }) => {
  let status = useSelector(statusAppSelector)
  let isLoggedIn = useSelector(isLoggedInSelector)
  let initialized = useSelector(initializedAppSelector)

  const { btnText, toggleTheme, logOutHandler, themeHandler } = useApp()

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
