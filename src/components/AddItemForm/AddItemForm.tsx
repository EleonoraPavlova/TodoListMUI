import React, { memo } from 'react'
import AddTaskIcon from '@mui/icons-material/AddTask'
import { IconButton, TextField } from '@mui/material'
import { useAddItemForm } from './hooks/useAddItemForm'

type Props = {
  addItem: (title: string) => Promise<any>
  disabled?: boolean
}

export const AddItemForm: React.FC<Props> = memo(({ disabled = false, addItem }) => {
  const { input, error, onKeyDownHandler, onBlurHandler, onChangeHandler, addTask } =
    useAddItemForm(addItem)

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
      <TextField
        value={input}
        disabled={disabled}
        onChange={onChangeHandler}
        onKeyDown={onKeyDownHandler}
        label="Value"
        size="small"
        onBlur={onBlurHandler}
        sx={{ mr: '3px', width: '200px' }}
        error={!!error}
        helperText={error}
      />
      <IconButton
        aria-label="delete"
        size="small"
        onClick={() => addTask(input)}
        sx={{ ml: '4px' }}
        disabled={disabled}>
        <AddTaskIcon color={disabled ? 'disabled' : 'success'} />
      </IconButton>
    </div>
  )
})
