import React, { memo } from 'react'
import { Button, ButtonProps } from '@mui/material'

type ButtonWithMuiProps = ButtonProps & {
  children: React.ReactNode
}

export const ButtonWithMui = memo(({ children, ...otherProps }: ButtonWithMuiProps) => {
  return <Button {...otherProps}>{children}</Button>
})
