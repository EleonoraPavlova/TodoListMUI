import React, { ChangeEvent, memo } from 'react';
import { Checkbox, IconButton, ListItem } from "@mui/material"
import { EditableSpan } from "../EditableSpan/EditableSpan";
import { Delete } from "@mui/icons-material";
import { RemoveTaskTC, UpdateTaskTC } from "../../state/reducers/tasks/tasks-reducer";
import { TaskStatuses, TaskTypeApi } from "../../api/tasks-api";
import { useAppDispatch, useAppSelector } from "../../state/hooks/hooks-selectors";
import { RequestStatusType } from "../../state/reducers/app-reducer/app-reducer";


type TaskProps = {
  task: TaskTypeApi
  todoListsId: string
  disabled: boolean
}

//рендер компоненты происходит, если пропсы меняются
export const Task: React.FC<TaskProps> = memo(({ task, todoListsId, disabled }) => {
  let status = useAppSelector<RequestStatusType>(state => state.app.status)
  const dispatch = useAppDispatch()

  const removeTaskHandler = () => {
    dispatch(RemoveTaskTC(todoListsId, task.id))
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const currentStatus = e.currentTarget.checked;
    const newStatus = currentStatus ? TaskStatuses.Completed : TaskStatuses.New;
    dispatch(UpdateTaskTC(todoListsId, task.id, { status: newStatus }))
  }

  const changeTaskTitleHandler = (title: string) => {
    dispatch(UpdateTaskTC(todoListsId, task.id, { title }))
  }

  return (
    <ListItem key={task.id}
      className={task.status === TaskStatuses.Completed ? "is-done" : ""}
      disablePadding
      divider
      sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: "14px" }}>
      <Checkbox edge="start"
        size="small" color="success"
        checked={!!task.status}
        onChange={changeTaskStatusHandler} disabled={disabled} />
      <EditableSpan title={task.title}
        changeTitle={changeTaskTitleHandler}
        isDone={task.status === TaskStatuses.Completed || status === "loading"}
      />
      <IconButton edge="end" aria-label="delete"
        size="small" onClick={removeTaskHandler}
        sx={{ ml: "4px" }}
        disabled={status === "loading"}>
        <Delete fontSize="inherit" sx={{ margin: "10px" }} />
      </IconButton>
    </ListItem>)
})
