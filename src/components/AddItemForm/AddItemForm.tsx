import React, { ChangeEvent, KeyboardEvent, memo, useState } from 'react'
import AddTaskIcon from '@mui/icons-material/AddTask'
import { IconButton, TextField } from '@mui/material'

export type AddItemFormProps = {
  errorText: string
  addItem: (title: string) => void //это нужно обвернуть в useCallBack
  disabled?: boolean
}

export const AddItemForm: React.FC<AddItemFormProps> = memo(
  ({ errorText, disabled = false, addItem }) => {
    console.log('AddItemForm')
    let [error, setError] = useState<string | null>(null)
    let [title, setTitle] = useState('')

    const addTasks = () => {
      if (title.trim() !== '') {
        addItem(title.trim())
        setTitle('')
      } else {
        setError(errorText)
      }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      setTitle(e.currentTarget.value)
    }

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if (error) setError(null)
      if (e.key === 'Enter') addTasks()
    }

    const onBlurHandler = () => {
      setError(null)
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <TextField
          value={title}
          disabled={disabled}
          onChange={onChangeHandler}
          onKeyDown={onKeyDownHandler}
          label="Value"
          size="small"
          onBlur={onBlurHandler}
          sx={{ mr: '3px' }}
          error={!!error} // !! преобразует в boolean
          helperText={error}
        />
        <IconButton
          aria-label="delete"
          size="small"
          onClick={addTasks}
          sx={{ ml: '4px' }}
          disabled={disabled}>
          <AddTaskIcon color={disabled ? 'disabled' : 'success'} />
        </IconButton>
      </div>
    )
  }
)
