import React from 'react'
import { useSelector } from 'react-redux'
import './App.css'
import { Box, CircularProgress, Container, CssBaseline } from '@mui/material'
import { ThemeProvider, styled } from '@mui/material/styles'
import LinearProgress from '@mui/material/LinearProgress'
import { SnackBar } from 'components/SnackBar'
import { initializedAppSelector, statusAppSelector } from 'BLL/reducers/appSlice'
import { Routing } from 'features/routes/Routing'
import { useApp } from './hooks/useApp'
import { lime } from '@mui/material/colors'
import { Appbar } from 'components/Appbar'

type Props = {
  demo?: boolean
}

export const App: React.FC<Props> = ({ demo = false }) => {
  let status = useSelector(statusAppSelector)
  let initialized = useSelector(initializedAppSelector)

  const { btnText, toggleTheme, themeHandler } = useApp()

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
        <Appbar btnText={btnText} toggleTheme={toggleTheme} />
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
