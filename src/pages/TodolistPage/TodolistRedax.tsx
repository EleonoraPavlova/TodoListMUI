import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { AddItemForm } from "../../components/AddItemForm/AddItemForm";
import { EditableSpan } from "../../components/EditableSpan/EditableSpan";
import { IconButton, List, Typography } from "@mui/material"
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import { AddTaskTC, SetTasksTC } from "../../state/reducers/tasks/tasks-reducer";
import { ChangeTodoListFilterTC, ChangeTodoListTitleTC, FilterValuesType, RemoveTodolistTC, TodolistDomainTypeApi } from "../../state/reducers/todolists/todolists-reducer";
import { ButtonMemo } from "../../components/ButtonMemo";
import { Task } from "../../components/Task/Task";
import { TaskStatuses, TaskTypeApi } from "../../api/tasks-api";
import { useAppDispatch, useAppSelector } from "../../state/hooks/hooks-selectors";
import { RequestStatusType } from "../../state/reducers/app-reducer/app-reducer";


export type TodolistRedaxProps = {
  todolists: TodolistDomainTypeApi
  demo?: boolean //демо режим мокового state
}

export const TodolistRedax: React.FC<TodolistRedaxProps> = memo(({ todolists, demo = false }) => {
  console.log("TodolistRedax")
  let { id, filter, title } = todolists // что входит todoLists пропсы,
  // ПИСАТЬ НУЖНО ТО, ЧТО НУЖНО ВЫТЯНУТЬ ИЗ state - разворачивание объекта todoLists

  //СТРОГО БРАТЬ ТЕ ДАННЫЕ, КОТОРЫЕ НУЖНЫ, ДЕСТРУКТУР ТУТ ДЕЛАТЬ НЕ НУЖНО!!ЛИШНИЕ ПЕРЕРЕНДЕРЫ
  let tasks = useAppSelector<TaskTypeApi[]>(tasks => tasks.tasks[id])//так вытянули
  //нужный массив tasks по id
  let status = useAppSelector<RequestStatusType>(state => state.app.status)//так вытянули 

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!demo) return
    dispatch(SetTasksTC(id))
  }, [dispatch, id, demo])


  const addItem = useCallback((title: string) => {
    dispatch(AddTaskTC(title, id))
  }, [dispatch, id])

  tasks = useMemo(() => {
    if (filter === "active") {
      tasks = tasks.filter(t => t.status === TaskStatuses.New);
    }
    if (filter === "completed") {
      tasks = tasks.filter(t => t.status === TaskStatuses.Completed);
    }
    return tasks
  }, [tasks, filter])

  const changeTodolistTitleHandler = useCallback((title: string) => {
    dispatch(ChangeTodoListTitleTC(id, title))
  }, [dispatch, id])

  const removeTodoListHandler = useCallback(() => {
    dispatch(RemoveTodolistTC(id))
  }, [dispatch, id]);


  const changeTodoListFilter = useCallback((todoListId: string, filter: FilterValuesType) => {
    dispatch(ChangeTodoListFilterTC(todoListId, title, filter))
  }, [dispatch, title])

  const onAllClickHandler = useCallback(() => (changeTodoListFilter(id, "all")), [changeTodoListFilter, id]);
  const onActiveClickHandler = useCallback(() => (changeTodoListFilter(id, "active")), [changeTodoListFilter, id]);
  const onCompletedClickHandler = useCallback(() => (changeTodoListFilter(id, "completed")), [changeTodoListFilter, id]);

  const tasksList: Array<JSX.Element> =
    tasks.map(t => {
      return (< Task key={t.id} task={t} todoListsId={id} disabled={status === "loading"} />)
    })

  return <>
    <Typography variant={"h6"} align="center" sx={{ fontWeight: "bold", paddingBottom: '8px' }}>
      <EditableSpan title={title} changeTitle={changeTodolistTitleHandler} isDone={status === "loading"} />
      <IconButton aria-label="delete"
        size="small"
        onClick={removeTodoListHandler}
        sx={{ ml: "4px" }} disabled={status === "loading"}>
        <CancelPresentationIcon color={status === "loading" ? "disabled" : "success"} />
      </IconButton>
    </Typography >
    <AddItemForm errorText="Mistake" addItem={addItem} disabled={status === "loading"} />
    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {tasksList}
    </List>
    <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: 6 }}>
      <ButtonMemo size="small" color="info" variant={filter === 'all' ? "outlined" : "text"}
        onClick={onAllClickHandler} children={"All"} sx={{ mr: "6px", flexGrow: 1 }} />
      <ButtonMemo size="small" color="success" variant={filter === 'active' ? "outlined" : "text"}
        onClick={onActiveClickHandler} children={"Active"} sx={{ mr: "6px", flexGrow: 1 }} />
      <ButtonMemo size="small" color="error" variant={filter === 'completed' ? "outlined" : "text"}
        onClick={onCompletedClickHandler} children={"Completed"} sx={{ mr: "6px" }} />
    </div>
  </>
})
