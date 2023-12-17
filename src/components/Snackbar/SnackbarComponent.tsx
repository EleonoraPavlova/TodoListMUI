import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useAppDispatch, useAppSelector } from "../../state/hooks/hooks-selectors";
import { setErrorAppAC, setSuccessAppAC } from "../../state/reducers/app-reducer/app-reducer";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function SnackbarComponent() { //вывод всплывающих сообщений ошибки и success
  let error = useAppSelector<string | null>(state => state.app.error) //null - не выводится всплывашка
  let success = useAppSelector<string | null>(state => state.app.success) //null - не выводится всплывашка
  // debugger
  const dispatch = useAppDispatch()

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return
    dispatch(setErrorAppAC(null))
    dispatch(setSuccessAppAC(null))
  };

  return (
    <Stack sx={{ width: '100%' }}>
      <Snackbar open={!!error || success !== null} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose}
          severity={success ? "success" : "error"}
          sx={{ width: '100%' }}>{success ? success : error}
        </Alert>
      </Snackbar>
    </Stack >
  );
}