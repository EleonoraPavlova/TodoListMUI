import React, { memo, useCallback, useMemo } from 'react'
import { IconButton, List, Typography } from '@mui/material'
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation'
import { tasksThunks } from 'app/BLL/reducers/tasksSlice'
import { AddItemForm } from 'components/AddItemForm'
import { ButtonWithMui } from 'components/ButtonWithMui'
import { FilterValues, Task, TodolistDomain } from 'common/types'
import { useAppDispatch, useAppSelector } from 'common/hooks/hooks-selectors'
import { TaskStatuses } from 'common/emuns'
import { todolistsThunks } from 'app/BLL/reducers/todolistsSlice'
import { TaskMap } from 'components/TaskMap'
import { EditableSpan } from 'components/EditableSpan'

type TodolistPageProps = {
  todolists: TodolistDomain
  demo?: boolean //демо режим мокового state
}

export const TodolistPage: React.FC<TodolistPageProps> = memo(({ todolists, demo = false }) => {
  let { id, filter, title, entityStatus } = todolists
  let tasks = useAppSelector<Task[]>((tasks) => tasks.tasks[id])

  const loading = entityStatus === 'loading'
  const dispatch = useAppDispatch()

  const addItem = useCallback(
    (title: string) => {
      dispatch(tasksThunks.addTaskTC({ title, todoListId: id }))
    },
    [dispatch, id]
  )

  tasks = useMemo(() => {
    let filtered = tasks

    if (filter === 'active') {
      filtered = filtered.filter((t) => t.status === TaskStatuses.New)
    }
    if (filter === 'completed') {
      filtered = filtered.filter((t) => t.status === TaskStatuses.Completed)
    }

    return filtered
  }, [tasks, filter])

  const changeTodolistTitleHandler = useCallback(
    (title: string) => {
      dispatch(todolistsThunks.updateTodolistTC({ todoListId: id, title, filter }))
    },
    [dispatch, id]
  )

  const removeTodoListHandler = useCallback(() => {
    dispatch(todolistsThunks.removeTodolistTC(id))
  }, [dispatch, id])

  const changeTodoListFilter = useCallback(
    (todoListId: string, filter: FilterValues) => {
      dispatch(todolistsThunks.updateTodolistTC({ todoListId, title, filter }))
    },
    [dispatch, title]
  )

  const onAllClickHandler = useCallback(
    () => changeTodoListFilter(id, 'all'),
    [changeTodoListFilter, id]
  )
  const onActiveClickHandler = useCallback(
    () => changeTodoListFilter(id, 'active'),
    [changeTodoListFilter, id]
  )
  const onCompletedClickHandler = useCallback(
    () => changeTodoListFilter(id, 'completed'),
    [changeTodoListFilter, id]
  )

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
          size="small"
          color="info"
          variant={filter === 'all' ? 'outlined' : 'text'}
          onClick={onAllClickHandler}
          children={'All'}
          sx={{ mr: '6px', flexGrow: 1 }}
          disabled={loading}
        />
        <ButtonWithMui
          size="small"
          color="success"
          variant={filter === 'active' ? 'outlined' : 'text'}
          onClick={onActiveClickHandler}
          children={'Active'}
          sx={{ mr: '6px', flexGrow: 1 }}
          disabled={loading}
        />
        <ButtonWithMui
          size="small"
          color="error"
          variant={filter === 'completed' ? 'outlined' : 'text'}
          onClick={onCompletedClickHandler}
          children={'Completed'}
          sx={{ mr: '6px' }}
          disabled={loading}
        />
      </div>
    </>
  )
})
