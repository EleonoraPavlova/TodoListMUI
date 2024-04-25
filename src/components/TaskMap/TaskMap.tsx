import React, { memo } from 'react'
import { Checkbox, IconButton, ListItem } from '@mui/material'
import { EditableSpan } from '../EditableSpan'
import { Delete } from '@mui/icons-material'
import { TaskStatuses } from 'common/emuns'
import { Task } from 'common/types'
import { useTaskMap } from './hooks/useTaskMap'

type TaskProps = {
  task: Task
  todoListId: string
}

export const TaskMap: React.FC<TaskProps> = memo(({ task, todoListId }) => {
  let { title } = task
  const {
    status,
    id,
    disabled,
    removeTaskHandler,
    changeTaskStatusHandler,
    changeTaskTitleHandler,
  } = useTaskMap(task, todoListId)

  return (
    <ListItem
      key={id}
      className={status === TaskStatuses.Completed ? 'is-done' : ''}
      disablePadding
      divider
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '14px',
      }}>
      <Checkbox
        edge="start"
        size="small"
        color="success"
        checked={!!status}
        onChange={changeTaskStatusHandler}
        disabled={disabled}
      />
      <EditableSpan
        title={title}
        changeTitle={changeTaskTitleHandler}
        isDone={status === TaskStatuses.Completed || disabled}
      />
      <IconButton
        edge="end"
        aria-label="delete"
        size="small"
        onClick={removeTaskHandler}
        sx={{ ml: '4px' }}
        disabled={disabled}>
        <Delete fontSize="inherit" sx={{ margin: '10px' }} />
      </IconButton>
    </ListItem>
  )
})
