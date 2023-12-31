import { todoListId1, todoListId2 } from "./idState"
import { TaskPriorities, TaskStatuses } from "../../api/tasks-api"
import { TasksStateType } from "../../apps/App"
import { v1 } from "uuid"

export const tasksInitialState: TasksStateType = ({
  [todoListId1]: [
    {
      id: v1(), title: "HTML&CSS", description: "", completed: false, status: TaskStatuses.Completed,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      todoListId: todoListId1,
      order: 1,
      addedDate: ""
    },
    {
      id: v1(), title: "JS", description: "", completed: false, status: TaskStatuses.Completed,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      todoListId: todoListId1,
      order: 1,
      addedDate: ""
    },
    {
      id: v1(), title: "ReactJS", description: "", completed: false, status: TaskStatuses.New,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      todoListId: todoListId1,
      order: 1,
      addedDate: ""
    },
    {
      id: v1(), title: "Rest API", description: "", completed: false, status: TaskStatuses.New,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      todoListId: todoListId1,
      order: 1,
      addedDate: ""
    },
    {
      id: v1(), title: "GraphQL", description: "", completed: false, status: TaskStatuses.New,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      todoListId: todoListId1,
      order: 1,
      addedDate: ""
    },
  ],
  [todoListId2]: [
    {
      id: v1(), title: "Milk", description: "", completed: true, status: TaskStatuses.Completed,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      todoListId: todoListId2,
      order: 1,
      addedDate: ""
    },
    {
      id: v1(), title: "Water", description: "", completed: true, status: TaskStatuses.Completed,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      todoListId: todoListId2,
      order: 1,
      addedDate: ""
    },
    {
      id: v1(), title: "Juice", description: "", completed: false, status: TaskStatuses.New,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      todoListId: todoListId2,
      order: 1,
      addedDate: ""
    },
    {
      id: v1(), title: "Fish", description: "", completed: false, status: TaskStatuses.New,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      todoListId: todoListId2,
      order: 1,
      addedDate: ""
    },
    {
      id: v1(), title: "Eggs", description: "", completed: false, status: TaskStatuses.New,
      priority: TaskPriorities.Low,
      startDate: "",
      deadline: "",
      todoListId: todoListId2,
      order: 1,
      addedDate: ""
    },
  ],
})
