import React, { memo } from 'react'
import { Button, ButtonProps } from '@mui/material'
import { FilterValues } from 'common/types'

type Props = ButtonProps & {
  children: React.ReactNode
  filter: FilterValues | boolean
}

export const ButtonCustom: React.FC<Props> = memo(({ children, filter, ...otherProps }) => {
  const variant = filter ? 'outlined' : 'text'

  return (
    <Button size="small" variant={variant} {...otherProps} sx={{ mr: '6px', flexGrow: '1' }}>
      {children}
    </Button>
  )
})
