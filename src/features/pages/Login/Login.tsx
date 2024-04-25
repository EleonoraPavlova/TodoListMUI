import React from 'react'
import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Box } from '@mui/material'
import { useLogin } from './hooks/useLogin'

export const Login = () => {
  const { formik } = useLogin()
  return (
    <Grid container justifyContent={'center'}>
      <Grid item justifyContent={'center'}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: '10px',
                  height: '45px',
                }}>
                <span>Email:</span> <h6>free@samuraijs.com</h6>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', height: '30px' }}>
                <span>Password:</span> <h6>free</h6>
              </Box>
            </FormLabel>

            <FormGroup>
              <TextField
                label="Email"
                margin="normal"
                autoComplete="email"
                error={!!(formik.touched.email && formik.errors.email)}
                {...formik.getFieldProps('email')}
              />

              {formik.touched.email && formik.errors.email ? (
                <h6 style={{ color: 'red', margin: '0px' }}>
                  {formik.touched.email && formik.errors.email}
                </h6>
              ) : null}

              <TextField
                label="Password"
                margin="normal"
                type="password"
                autoComplete="password"
                error={!!(formik.touched.password && formik.errors.password)}
                {...formik.getFieldProps('password')}
              />

              {formik.touched.password && formik.errors.password ? (
                <h6 style={{ color: 'red', margin: '0px' }}>
                  {formik.touched.password && formik.errors.password}
                </h6>
              ) : null}

              <FormControlLabel
                label={'Remember me'}
                control={
                  <Checkbox
                    checked={formik.values.rememberMe}
                    {...formik.getFieldProps('rememberMe')}
                  />
                }
              />
              <Button
                type={'submit'}
                variant={'contained'}
                color={'primary'}
                sx={{ color: 'white', margin: '20px 0' }}
                disabled={formik.isSubmitting || !(formik.dirty && formik.isValid)}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  )
}
