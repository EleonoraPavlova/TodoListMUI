export enum ResultCode { //enum  ONLY for reading, cannot be overwritten!!
  SUCCEEDED = 0,
  ERROR = 1,
  ERROR_CAPTCHA = 10,
}

export enum TaskStatuses {
  New = 0, // false
  inProgress = 1,
  Completed = 2, // true
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}
