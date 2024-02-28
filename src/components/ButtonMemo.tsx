import React, { memo } from 'react'
import { Button, ButtonProps } from '@mui/material' //взяла ВСЕ props которые лежат по дефолту в mui

type ButtonMemoType = ButtonProps & {
  children: React.ReactNode // это нода реакта
  //это может быть текст, число, другой компонент, картинка
}

//interface ButtonMemoType extends ButtonProps { } - можно записать вот так

export const ButtonMemo = memo(({ children, ...otherProps }: ButtonMemoType) => {
  console.log('ButtonMemo')
  return <Button {...otherProps}>{children}</Button>
})

//{...otherProps} все пропсы которые по дефолту нам представляет mui
