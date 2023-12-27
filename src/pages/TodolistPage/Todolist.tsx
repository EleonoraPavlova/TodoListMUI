import React, { useEffect } from 'react';
import { AddItemForm } from "../../components/AddItemForm/AddItemForm";
import { EditableSpan } from "../../components/EditableSpan/EditableSpan";
import { Button, IconButton, List, Typography } from "@mui/material"
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import { Task } from "../../components/Task/Task";
import { TaskStatuses, TaskTypeApi } from "../../api/tasks-api";
import { FilterValuesType } from "../../state/reducers/todolists/todolists-reducer";
import { SetTasksTC } from "../../state/reducers/tasks/tasks-reducer";
import { useAppDispatch } from "../../state/hooks/hooks-selectors";


// export type TaskType = {
//   id: string
//   title: string
//   isDone: boolean
// }

export type TodolistPropsType = {
  title: string
  tasks: TaskTypeApi[]
  todoListsId: string
  filter: FilterValuesType
  removeTask: (todoListsId: string, taskId: string) => void
  changeTodoListFilter: (todoListsId: string, title: string, filter: FilterValuesType) => void
  addTask: (title: string, todoListsId: string) => void
  changeTaskStatus: (todoListsId: string, taskId: string, status: TaskStatuses) => void
  changeTaskTitle: (todoListsId: string, taskId: string, title: string) => void
  removeTodoList: (todoListsId: string) => void
  changeTodolistTitle: (todoListsId: string, title: string) => void
}

export function Todolist(props: TodolistPropsType) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(SetTasksTC(props.todoListsId))
  }, [])

  const addItem = (title: string) => {
    props.addTask(title, props.todoListsId);
  }

  const onAllClickHandler = () => props.changeTodoListFilter(props.todoListsId, props.title, "all");
  const onActiveClickHandler = () => props.changeTodoListFilter(props.todoListsId, props.title, "active");
  const onCompletedClickHandler = () => props.changeTodoListFilter(props.todoListsId, props.title, "completed");
  const removeTodoListHandler = () => props.removeTodoList(props.todoListsId);


  const tasksList = () => {
    return props.tasks.map(t => (<Task key={t.id} task={t} todoListsId={t.id} />))
  }

  const changeEditableSpanTitleHandler = (title: string) => {
    props.changeTodolistTitle(props.todoListsId, title);
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