import { TasksStateType } from "../../apps/App";
import { todoListId1, todoListId2 } from "../initialState/idState";
import { tasksInitialState } from "../initialState/tasksInitialState";
import { tasksReducer } from "./tasks/tasks-reducer";
import { removeTodolistAC, todolistReducer, addTodolistAC, TodolistDomainTypeApi } from "./todolists/todolists-reducer";

test('ids should be equals', () => {
  const startTasksState: TasksStateType = {};
  const startTodolistsState: TodolistDomainTypeApi[] = [];
  let newTodolist = { id: todoListId1, title: "Added todolist", filter: "all", addedDate: "", order: 1 };

  const action = addTodolistAC(newTodolist);

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.todolist.id); //сравниваю с тем значением которое должно прийти из action типа
  expect(idFromTodolists).toBe(action.todolist.id);
});


test('property with todolistId should be deleted', () => {
  const startState = tasksInitialState

  const action = removeTodolistAC(todoListId2);
  const endState = tasksReducer(startState, action)


  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistId2"]).not.toBeDefined();
});