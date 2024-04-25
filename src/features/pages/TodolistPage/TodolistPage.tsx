import React, { memo } from 'react'
import { IconButton, List, Typography } from '@mui/material'
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation'
import { AddItemForm } from 'components/AddItemForm'
import { ButtonWithMui } from 'components/ButtonWithMui'
import { TodolistDomain } from 'common/types'
import { TaskMap } from 'components/TaskMap'
import { EditableSpan } from 'components/EditableSpan'
import { useTodoListPage } from './hooks/useTodolistPage'

type TodolistPageProps = {
  todolists: TodolistDomain
  demo?: boolean //moc state
}

export const TodolistPage: React.FC<TodolistPageProps> = memo(({ todolists, demo = false }) => {
  const {
    loading,
    tasks,
    filter,
    title,
    id,
    addItem,
    changeTodolistTitleHandler,
    removeTodoListHandler,
    onAllClickHandler,
    onActiveClickHandler,
    onCompletedClickHandler,
  } = useTodoListPage(todolists)

  const tasksList: Array<JSX.Element> = tasks.map((t) => {
    return <TaskMap key={t.id} task={t} todoListId={id} />
  })

  return (
    <>
      <Typography variant={'h6'} align="center" sx={{ fontWeight: 'bold', paddingBottom: '8px' }}>
        <EditableSpan title={title} changeTitle={changeTodolistTitleHandler} isDone={loading} />
        <IconButton
          aria-label="delete"
          size="small"
          onClick={removeTodoListHandler}
          sx={{ ml: '4px' }}
          disabled={loading}>
          <CancelPresentationIcon color={loading ? 'disabled' : 'success'} />
        </IconButton>
      </Typography>
      <AddItemForm errorText="Mistake" addItem={addItem} disabled={loading} />
      <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {tasksList}
      </List>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: 6 }}>
        <ButtonWithMui
          color="info"
          filter={filter === 'all'}
          onClick={onAllClickHandler}
          children={'All'}
        />
        <ButtonWithMui
          color="success"
          filter={filter === 'active'}
          onClick={onActiveClickHandler}
          children={'Active'}
          disabled={loading}
        />
        <ButtonWithMui
          color="error"
          filter={filter === 'completed'}
          onClick={onCompletedClickHandler}
          children={'Completed'}
          disabled={loading}
        />
      </div>
    </>
  )
})
