import React, { memo, useCallback, useMemo } from 'react'
import { AddItemForm } from '../../components/AddItemForm/AddItemForm'
import { EditableSpan } from '../../components/EditableSpan/EditableSpan'
import { IconButton, List, Typography } from '@mui/material'
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation'
import { addTaskTC } from '../../state/reducers/tasks/tasks-reducer'
import {
  FilterValuesType,
  TodolistDomainTypeApi,
  removeTodolistTC,
  updateTodolistTC,
} from '../../state/reducers/todolists/todolists-reducer'
import { ButtonMemo } from '../../components/ButtonMemo'
import { Task } from '../../components/Task/Task'
import { TaskStatuses, TaskTypeApi } from '../../api/tasks-api'
import { useAppDispatch, useAppSelector } from '../../state/hooks/hooks-selectors'

export type TodolistRedaxProps = {
  todolists: TodolistDomainTypeApi
  demo?: boolean //демо режим мокового state
}

export const TodolistRedax: React.FC<TodolistRedaxProps> = memo(({ todolists, demo = false }) => {
  let { id, filter, title, entityStatus } = todolists // что входит todoLists пропсы,
  // ПИСАТЬ НУЖНО ТО, ЧТО НУЖНО ВЫТЯНУТЬ ИЗ state - разворачивание объекта todoLists

  //СТРОГО БРАТЬ ТЕ ДАННЫЕ, КОТОРЫЕ НУЖНЫ, ДЕСТРУКТУР ТУТ ДЕЛАТЬ НЕ НУЖНО!!ЛИШНИЕ ПЕРЕРЕНДЕРЫ
  let tasks = useAppSelector<TaskTypeApi[]>(tasks => tasks.tasks[id]) //так вытянули
  //нужный массив tasks по id
  const loading = entityStatus === 'loading'
  const dispatch = useAppDispatch()

  // useEffect(() => {
  //   // if (!demo) return
  // }, [])

  const addItem = useCallback(
    (title: string) => {
      dispatch(addTaskTC({ title, todoListId: id }))
    },
    [dispatch, id]
  )

  tasks = useMemo(() => {
    let filtered = tasks

    if (filter === 'active') {
      filtered = filtered.filter(t => t.status === TaskStatuses.New)
    }
    if (filter === 'completed') {
      filtered = filtered.filter(t => t.status === TaskStatuses.Completed)
    }

    return filtered
  }, [tasks, filter])

  const changeTodolistTitleHandler = useCallback(
    (title: string) => {
      dispatch(updateTodolistTC({ todoListId: id, title, filter }))
    },
    [dispatch, id]
  )

  const removeTodoListHandler = useCallback(() => {
    dispatch(removeTodolistTC(id))
  }, [dispatch, id])

  const changeTodoListFilter = useCallback(
    (todoListId: string, filter: FilterValuesType) => {
      dispatch(updateTodolistTC({ todoListId, title, filter }))
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

  const tasksList: Array<JSX.Element> = tasks.map(t => {
    return <Task key={t.id} task={t} todoListId={id} />
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
          disabled={loading}
        >
          <CancelPresentationIcon color={loading ? 'disabled' : 'success'} />
        </IconButton>
      </Typography>
      <AddItemForm errorText="Mistake" addItem={addItem} disabled={loading} />
      <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {tasksList}
      </List>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: 6 }}>
        <ButtonMemo
          size="small"
          color="info"
          variant={filter === 'all' ? 'outlined' : 'text'}
          onClick={onAllClickHandler}
          children={'All'}
          sx={{ mr: '6px', flexGrow: 1 }}
          disabled={loading}
        />
        <ButtonMemo
          size="small"
          color="success"
          variant={filter === 'active' ? 'outlined' : 'text'}
          onClick={onActiveClickHandler}
          children={'Active'}
          sx={{ mr: '6px', flexGrow: 1 }}
          disabled={loading}
        />
        <ButtonMemo
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
