import { createAsyncThunk } from '@reduxjs/toolkit'
import { AppDispatch, AppRootState } from 'BLL/store'
import { ResponseBase, ThunkErrorApiConfig } from 'common/types'

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootState
  dispatch: AppDispatch
  rejectValue: null | ThunkErrorApiConfig | ResponseBase
}>()
