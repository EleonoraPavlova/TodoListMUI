import { AxiosError } from 'axios'
import { ResponseBase } from 'common/types'
import { ChangeEvent, useCallback, useState, KeyboardEvent } from 'react'

export function useAddItemForm(addItem: (title: string) => Promise<any>) {
  let [error, setError] = useState<string | null>(null)
  let [input, setInput] = useState('')

  const addTask = useCallback(
    (title: string) => {
      if (/[a-zA-Zа-яА-ЯёЁ0-9]/i.test(title) && title.length >= 3) {
        addItem(title)
          .then(() => {
            setInput('')
          })
          .catch((e: ResponseBase | AxiosError) => {
            if ('fieldsErrors' in e) {
              setError(e.messages[0])
            } else {
              setError(e.message)
            }
          })
      } else {
        setError('min 3 characters')
      }
    },
    [addItem, setInput, setError, input]
  )

  const onChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value
      setInput(value)
      if (value.length > 100) setError('max 100 characters')
    },
    [setInput]
  )

  const onKeyDownHandler = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (error) setError(null)
      if (e.key === 'Enter') addTask(input)
    },
    [setError, addTask]
  )

  const onBlurHandler = useCallback(() => {
    setError(null)
  }, [setError])

  return { input, error, onKeyDownHandler, onBlurHandler, onChangeHandler, addTask }
}
