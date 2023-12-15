import { AddTaskAC, ChangeTaskStatusAC, ChangeTaskTitleAC, RemoveTaskAC, SetTaskskAC, tasksReducer } from './tasks-reducer'
import { TasksStateType } from '../../../apps/App'
import { AddTodolistAC } from "../todolists/todolists-reducer"
import { tasksInitialState } from "../../initialState/tasksInitialState"
import { todoListId1, todoListId2 } from "../../initialState/idState"
import { TaskPriorities, TaskStatuses } from "../../../api/tasks-api"
import { v1 } from "uuid"

let startState: TasksStateType

beforeEach(() => { //Выполняет функцию перед выполнением тестов в текущем файле
  startState = tasksInitialState
})


test('correct task should be deleted from correct array', () => {
  const action = RemoveTaskAC(todoListId2, startState[todoListId2][0].id)

  const endState = tasksReducer(startState, action)

  expect(endState[todoListId2][0].title).toBe("Water")
})


test('correct task should be added to correct array', () => {
  const action = AddTaskAC({
    id: v1(), title: "Juice", description: "", completed: false, status: TaskStatuses.New,
    priority: TaskPriorities.Low,
    startDate: "",
    deadline: "",
    todoListId: todoListId1,
    order: 1,
    addedDate: ""
  },);

  const endState = tasksReducer(startState, action)

  expect(endState[todoListId1].length).toBe(6);
  expect(endState[todoListId1][0].title).toBe("Juice");
  expect(endState[todoListId1][1].title).toBe("HTML&CSS");
  expect(endState[todoListId1][0].status).toBe(TaskStatuses.New);
})

test('status of specified task should be changed', () => {
  const action = ChangeTaskStatusAC(todoListId2, startState[todoListId2][1].id, TaskStatuses.New);

  const endState = tasksReducer(startState, action)

  expect(endState[todoListId2][1].status).toBe(TaskStatuses.New);
  expect(startState[todoListId2][1].status).toBe(TaskStatuses.Completed);
});


test('title of specified task should be changed', () => {
  const action = ChangeTaskTitleAC(todoListId2, startState[todoListId2][1].id, "Potatos");

  const endState = tasksReducer(startState, action)

  expect(endState[todoListId2][1].title).toBe("Potatos");
  expect(startState[todoListId2][1].title).toBe("Water");
});


test('new array should be added when new todolist is added', () => {
  let newTodolist = { id: "todoListId1", title: "Added todolist", filter: "all", addedDate: "", order: 1 };
  const action = AddTodolistAC(newTodolist);
  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState);

  const newKey = keys.find(k => k != todoListId1 && k != todoListId2);
  if (!newKey) {
    throw Error("new key should be added")
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});


test('tasks should be added for todolist', () => {
  const action = SetTaskskAC(todoListId1, startState[todoListId1]);
  const endState = tasksReducer({
    [todoListId1]: [],
    [todoListId2]: [],
  }, action)


  expect(endState[todoListId1].length).toBe(5); //положили в пустой todoListId1 таски 4 шт
  expect(endState[todoListId2].length).toBe(0);//ничего не положили в пустой todoListId2 таски 
});