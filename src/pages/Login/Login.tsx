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
import { LoginTC } from "../../state/reducers/auth/auth-reducers";
import { LoginParamsType } from "../../api/auth-api";
import { handleServerNetworkError } from "../../utils/error-utils";


export const Login = () => {
  const dispatch = useAppDispatch()

  const formik = useFormik({
    validate: (values) => {
      const errors: Partial<LoginParamsType> = {}

      if (!values.email) {
        errors.email = 'Required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
      }

      if (!values.password) {
        errors.password = 'Required';
      } else if (values.password.length < 5) {
        errors.password = 'Must be more 5 symbols';
      }

      return errors
    },
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    onSubmit: async (values, { setFieldValue, setSubmitting }) => {
      setSubmitting(true)
      try {
        await dispatch(LoginTC(values))
        setFieldValue("password", "")
      } catch (err) {
        handleServerNetworkError(err as { message: string }, dispatch)
      }
      setSubmitting(false)
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
              <TextField label="Email"
                margin="normal"
                autoComplete="email"
                error={!!(formik.touched.email && formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                {...formik.getFieldProps("email")}
              />

              <TextField label="Password"
                margin="normal"
                type="password"
                autoComplete="password"
                error={!!(formik.touched.password && formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                {...formik.getFieldProps("password")}
              />

              <FormControlLabel label={'Remember me'} control={<Checkbox
                checked={formik.values.rememberMe}
                {...formik.getFieldProps("rememberMe")} />}
              />
              <Button type={'submit'}
                variant={'contained'}
                color={'primary'}
                sx={{ color: 'white', margin: "20px 0" }}
                disabled={
                  formik.isSubmitting ||
                  !(formik.dirty && formik.isValid)
                }
              >Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid >
  )
}