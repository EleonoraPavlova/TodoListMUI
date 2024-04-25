import { authThunks } from 'BLL/reducers/authSlice'
import { useAppDispatch } from 'common/hooks/hooks-selectors'
import { LoginParams, ResponseBase, ThunkErrorApiConfig } from 'common/types'
import { handleServerNetworkError } from 'common/utils'
import { useFormik } from 'formik'

export function useLogin() {
  const dispatch = useAppDispatch()

  const formik = useFormik({
    validate: (values) => {
      const errors: Partial<LoginParams> = {}

      if (!values.email) {
        errors.email = 'Required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
      }

      if (!values.password) {
        errors.password = 'Required'
      } else if (values.password.length < 4) {
        errors.password = 'Must be more 4 symbols'
      }

      return errors
    },
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      setSubmitting(true)
      try {
        await dispatch(authThunks.loginTC(values))
          .unwrap()
          .then((res) => console.log('res', res))
          .catch((e: ThunkErrorApiConfig | ResponseBase) => {
            if ('errors' in e) {
              setFieldError('email', e.errors[0])
              setFieldError('password', e.errors[0])
            } else if ('messages' in e) {
              const { fieldsErrors } = e
              fieldsErrors.forEach((el) => {
                setFieldError(el.field, el.error)
              })
            }
          })
      } catch (err) {
        handleServerNetworkError(err as { message: string }, dispatch)
      }
      setSubmitting(false)
    },
  })

  return {
    formik,
  }
}
