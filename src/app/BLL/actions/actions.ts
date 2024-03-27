import { createAction } from '@reduxjs/toolkit'
import { Tasks, TodolistDomain } from 'common/types'

export type ClearTasksTodolists = {
  tasks: Tasks
  todolists: TodolistDomain[]
}

export const clearTasksTodolists = createAction<ClearTasksTodolists>('actions/clearTasksTodolists')
