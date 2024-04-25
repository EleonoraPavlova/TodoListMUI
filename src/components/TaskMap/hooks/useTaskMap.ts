import { tasksThunks } from 'BLL/reducers/tasksSlice'
import { TaskStatuses } from 'common/emuns'
import { useActions } from 'common/hooks'
import { Task } from 'common/types'
import { ChangeEvent } from 'react'

export function useTaskMap(task: Task, todoListId: string) {
  let { id, status } = task
  const disabled = status === TaskStatuses.inProgress
  const { removeTaskTC, updateTaskTC } = useActions(tasksThunks)

  const removeTaskHandler = () => {
    removeTaskTC({ todoListId, taskId: task.id })
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const currentStatus = e.currentTarget.checked
    const newStatus = currentStatus ? TaskStatuses.Completed : TaskStatuses.New
    updateTaskTC({ todoListId, taskId: id, model: { status: newStatus } })
  }

  const changeTaskTitleHandler = (title: string) => {
    updateTaskTC({ todoListId, taskId: id, model: { title } })
  }
  return {
    status,
    id,
    disabled,
    removeTaskHandler,
    changeTaskStatusHandler,
    changeTaskTitleHandler,
  }
}
