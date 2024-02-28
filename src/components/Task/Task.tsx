import React, { ChangeEvent, memo } from 'react'
import { Checkbox, IconButton, ListItem } from '@mui/material'
import { EditableSpan } from '../EditableSpan/EditableSpan'
import { Delete } from '@mui/icons-material'
import { removeTaskTC, updateTaskTC } from '../../state/reducers/tasks/tasks-reducer'
import { TaskStatuses, TaskTypeApi } from '../../api/tasks-api'
import { useAppDispatch } from '../../state/hooks/hooks-selectors'

type TaskProps = {
  task: TaskTypeApi
  todoListId: string
}

//рендер компоненты происходит, если пропсы меняются
export const Task: React.FC<TaskProps> = memo(({ task, todoListId }) => {
  let { id, title, status } = task
  const disabled = status === TaskStatuses.inProgress
  const dispatch = useAppDispatch()

  const removeTaskHandler = () => {
    dispatch(removeTaskTC({ todoListId, taskId: task.id }))
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const currentStatus = e.currentTarget.checked
    const newStatus = currentStatus ? TaskStatuses.Completed : TaskStatuses.New
    dispatch(updateTaskTC({ todoListId, taskId: id, model: { status: newStatus } }))
  }

  const changeTaskTitleHandler = (title: string) => {
    dispatch(updateTaskTC({ todoListId, taskId: id, model: { title } }))
  }

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
