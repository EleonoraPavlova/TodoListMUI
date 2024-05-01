import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { authThunks, isLoggedInSelector } from 'BLL/reducers/authSlice'
import { useActions } from 'common/hooks'

type Props = {
  btnText: string
  toggleTheme: () => void
}

export const Appbar: React.FC<Props> = ({ btnText, toggleTheme }) => {
  let isLoggedIn = useSelector(isLoggedInSelector)
  const { logOutTC } = useActions(authThunks)

  const logOutHandler = useCallback(() => {
    logOutTC()
  }, [isLoggedIn, logOutTC])

  return (
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
  )
}
