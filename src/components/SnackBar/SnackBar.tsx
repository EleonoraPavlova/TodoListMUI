import * as React from 'react'
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import {
  errorAppSelector,
  setErrorAppAC,
  setSuccessAppAC,
  successAppSelector,
} from '../../app/BLL/reducers/appSlice/appSlice'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'common/hooks/hooks-selectors'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export function SnackBar() {
  let error = useSelector(errorAppSelector) //null - не выводится всплывашка
  let success = useSelector(successAppSelector) //null - не выводится всплывашка
  const dispatch = useAppDispatch()

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return
    dispatch(setErrorAppAC({ error: null }))
    dispatch(setSuccessAppAC({ success: null }))
  }

  if (!error && !success) return null

  return (
    <Stack sx={{ width: '100%' }}>
      <Snackbar open={!!error || !!success} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={success ? 'success' : 'error'}
          sx={{ width: '100%' }}>
          {success ? success : error}
        </Alert>
      </Snackbar>
    </Stack>
  )
}
