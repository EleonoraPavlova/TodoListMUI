import {
  addTodolistAC,
  changeTodoListFilterAC,
  changeTodoListTitleAC,
  changeTodolistEntityStatusAC,
  FilterValuesType,
  removeTodolistAC,
  getTodoListAC,
  todolistReducer
} from "./todolists-reducer";
import { todoListId1, todoListId2 } from "../../initialState/idState";
import { todolistInitialState } from "../../initialState/todolistsInitialState";
import { RequestStatusType } from "../app/app-reducer";

let startState = todolistInitialState


test('correct todolist should be removed', () => {
  //action можно писать вместо функц removeTodolistAC(todolistId1)
  // const action: removeTodolistACtion = { type: "REMOVE-TODOLIST", todoListsId: todolistId1 }

  const endState =
    todolistReducer(startState, removeTodolistAC(todoListId1)) //  todolistReducer(startState, action)

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todoListId2);
})


test('should be added correct todolist ', () => {
  let newTodolist = { id: todoListId1, title: "Added todolist", filter: "all", addedDate: "", order: 1 };

  const endState = todolistReducer(startState, addTodolistAC(newTodolist))

  expect(endState.length).toBe(3);
  expect(endState[0].order).toBe(1);
  expect(endState.length).toBe(3);
});


test('should be change title todolist ', () => {
  let newTodolistTitle = "Change title";

  //const action: changeTodoListTitleACtion = { type: "CNAHGE-TODOLIST-TITLE", todoListsId: todolistId1, title: newTodolistTitle }

  const endState = todolistReducer(startState, changeTodoListTitleAC(todoListId1, newTodolistTitle))

  expect(endState.length).toBe(2);
  expect(endState[0].title).toBe(newTodolistTitle);
});


test('should be change filter todolist ', () => {
  let newFilter: FilterValuesType = "active";

  //const action: changeTodoListFilterACtion = { type: "CNAHGE-TODOLIST-FILTER", todoListsId: todolistId2, filter: newFilter }

  const endState = todolistReducer(startState, changeTodoListFilterAC(todoListId2, startState[1].title, newFilter))

  expect(endState.length).toBe(2);
  expect(endState[1].filter).toBe("active");
});


test('todolist should be set', () => {
  //const action: changeTodoListFilterACtion = { type: "CNAHGE-TODOLIST-FILTER", todoListsId: todolistId2, filter: newFilter }

  const endState = todolistReducer([], getTodoListAC(startState))

  const keys = Object.keys(endState)

  expect(keys.length).toBe(2) //одно и тоже
  expect(endState.length).toBe(2);//
  expect(endState[1].id).toBe(todoListId2);
  expect(endState[0].id).toBe(todoListId1)
});


test('todolist entityStatus should be changed', () => {
  let newStatus: RequestStatusType = "succeeded"
  const endState = todolistReducer(startState, changeTodolistEntityStatusAC(startState[0].id, newStatus))

  expect(endState[0].entityStatus).toBe(newStatus)
  expect(startState[0].entityStatus).toBe("idle");
});