import React, { memo, useMemo } from 'react'
import { List } from '@mui/material'
import { FilterValues, Task } from 'common/types'
import { TaskMap } from 'components/TaskMap'
import { useAppSelector } from 'common/hooks'
import { TaskStatuses } from 'common/emuns'

type Props = {
  id: string
  filter: FilterValues
}

export const Tasks: React.FC<Props> = memo(({ id, filter }) => {
  let tasks = useAppSelector<Task[]>((tasks) => tasks.tasks[id])

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

  const tasksList: Array<JSX.Element> = tasks.map((t) => {
    return <TaskMap key={t.id} task={t} todoListId={id} />
  })

  return (
    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {tasksList}
    </List>
  )
})
