import { tasksThunks } from 'BLL/reducers/tasksSlice'
import { todolistsThunks } from 'BLL/reducers/todolistsSlice'
import { TaskStatuses } from 'common/emuns'
import { useActions } from 'common/hooks'
import { useAppSelector } from 'common/hooks/selectors'
import { FilterValues, Task, TodolistDomain } from 'common/types'
import { useCallback, useMemo } from 'react'

export function useTodoListPage(todolists: TodolistDomain) {
  let { id, filter, title, entityStatus } = todolists
  let tasks = useAppSelector<Task[]>((tasks) => tasks.tasks[id])

  const loading = entityStatus === 'loading'

  const { addTaskTC } = useActions(tasksThunks)
  const { updateTodolistTC, removeTodolistTC } = useActions(todolistsThunks)

  const addItem = useCallback(
    (title: string) => {
      addTaskTC({ title, todoListId: id })
    },
    [addTaskTC, id]
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
      updateTodolistTC({ todoListId: id, title, filter })
    },
    [updateTodolistTC, id]
  )

  const removeTodoListHandler = useCallback(() => {
    removeTodolistTC(id)
  }, [removeTodolistTC, id])

  const changeTodoListFilter = useCallback(
    (todoListId: string, filter: FilterValues) => {
      updateTodolistTC({ todoListId, title, filter })
    },
    [updateTodolistTC, title]
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
