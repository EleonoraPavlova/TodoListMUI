import React, { useEffect } from 'react';
import { AddItemForm } from "../../components/AddItemForm/AddItemForm";
import { EditableSpan } from "../../components/EditableSpan/EditableSpan";
import { Button, IconButton, List, Typography } from "@mui/material"
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import { Task } from "../../components/Task/Task";
import { TaskStatuses, TaskTypeApi } from "../../api/tasks-api";
import { FilterValuesType } from "../../state/reducers/todolists/todolists-reducer";
import { getTasksTC } from "../../state/reducers/tasks/tasks-reducer";
import { useAppDispatch } from "../../state/hooks/hooks-selectors";


// export type TaskType = {
//   id: string
//   title: string
//   isDone: boolean
// }

export type TodolistPropsType = {
  title: string
  tasks: TaskTypeApi[]
  todoListId: string
  filter: FilterValuesType
  removeTask: (todoListId: string, taskId: string) => void
  changeTodoListFilter: (todoListId: string, title: string, filter: FilterValuesType) => void
  addTask: (title: string, todoListId: string) => void
  changeTaskStatus: (todoListId: string, taskId: string, status: TaskStatuses) => void
  changeTaskTitle: (todoListId: string, taskId: string, title: string) => void
  removeTodoList: (todoListId: string) => void
  changeTodolistTitle: (todoListId: string, title: string) => void
}

export function Todolist(props: TodolistPropsType) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getTasksTC(props.todoListId))
  }, [])

  const addItem = (title: string) => {
    props.addTask(title, props.todoListId);
  }

  const onAllClickHandler = () => props.changeTodoListFilter(props.todoListId, props.title, "all");
  const onActiveClickHandler = () => props.changeTodoListFilter(props.todoListId, props.title, "active");
  const onCompletedClickHandler = () => props.changeTodoListFilter(props.todoListId, props.title, "completed");
  const removeTodoListHandler = () => props.removeTodoList(props.todoListId);


  const tasksList = () => {
    return props.tasks.map(t => (<Task key={t.id} task={t} todoListId={t.id} />))
  }

  const changeEditableSpanTitleHandler = (title: string) => {
    props.changeTodolistTitle(props.todoListId, title);
  }

  return <>
    <Typography variant={"h6"} align="center" sx={{ fontWeight: "bold", paddingBottom: '8px' }}>
      <EditableSpan title={props.title} changeTitle={changeEditableSpanTitleHandler} />
      <IconButton aria-label="delete" size="small" onClick={removeTodoListHandler} sx={{ ml: "4px" }}>
        <CancelPresentationIcon color={"info"} />
      </IconButton>
    </Typography >
    <AddItemForm errorText="Mistake" addItem={addItem} />
    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {tasksList()}
    </List>
    <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: 6 }}>
      <Button size="small" color="info" variant={props.filter === 'all' ? "outlined" : "text"}
        onClick={onAllClickHandler} children={"All"} sx={{ mr: "6px", flexGrow: 1 }} />
      <Button size="small" color="success" variant={props.filter === 'active' ? "outlined" : "text"}
        onClick={onActiveClickHandler} children={"Active"} sx={{ mr: "6px", flexGrow: 1 }} />
      <Button size="small" color="error" variant={props.filter === 'completed' ? "outlined" : "text"}
        onClick={onCompletedClickHandler} children={"Completed"} sx={{ mr: "6px" }} />
    </div>
  </>
}