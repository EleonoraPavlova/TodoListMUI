import { tasksThunks } from 'BLL/reducers/tasksSlice'
import { todolistsThunks } from 'BLL/reducers/todolistsSlice'
import { TaskStatuses } from 'common/emuns'
import { useAppDispatch, useAppSelector } from 'common/hooks/hooks-selectors'
import { FilterValues, Task, TodolistDomain } from 'common/types'
import { useCallback, useMemo } from 'react'

export function useTodoListPage(todolists: TodolistDomain) {
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

  return {
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
  }
}
