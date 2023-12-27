import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useFormik } from "formik";
import { Typography } from "@mui/material";
import { useAppDispatch } from "../../state/hooks/hooks-selectors";
import { loginTC } from "../../state/reducers/auth/auth-reducers";
import { LoginParamsType } from "../../api/auth-api";


export const Login = () => {
  const dispatch = useAppDispatch()

  const formik = useFormik({
    validate: (values) => {
      const errors: Partial<LoginParamsType> = {}

      if (!values.email) {
        errors.email = 'email is required';
      }
      if (!values.password) {
        errors.password = 'password is required';
      }
      return errors
    },
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    onSubmit: (values) => {
      dispatch(loginTC(values))
    }
  })


  return (
    < Grid container justifyContent={'center'} >
      <Grid item justifyContent={'center'}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <Typography variant="body1" fontWeight="bold" sx={{ paddingTop: "15px" }}>To log in get registered</Typography>
            </FormLabel>
            <FormGroup>
              <TextField label="Email" margin="normal" autoComplete="email"
                {...formik.getFieldProps("email")}
              />
              {formik.errors.email && formik.touched.email && (
                <Typography variant="body2" color="error" component="span">
                  {formik.errors.email}
                </Typography>
              )}

              <TextField label="Password" margin="normal" type="password" autoComplete="password"
                {...formik.getFieldProps("password")}
              />
              {formik.errors.password && formik.touched.password && (
                <Typography variant="body2" color="error" component="span">
                  {formik.errors.password}
                </Typography>
              )}
              <FormControlLabel label={'Remember me'} control={<Checkbox
                checked={formik.values.rememberMe}
                {...formik.getFieldProps("rememberMe")} />}
              />
              <Button type={'submit'} variant={'contained'} color={'primary'} sx={{ color: 'white' }}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  )
}