import { ResponseBase, ThunkErrorApiConfig } from 'common/types'
import { handleServerNetworkError } from './handleServerNetworkError'
import { AppDispatch, AppRootState } from 'BLL/store'
import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk'

export const thunkTryCatch = async <T>(
  thunkAPI: BaseThunkAPI<
    AppRootState,
    unknown,
    AppDispatch,
    null | ResponseBase | ThunkErrorApiConfig
  >,
  logic: () => Promise<T>
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI
  // dispatch(setStatusAppAC({ status: 'loading' }))
  try {
    return await logic()
  } catch (e) {
    //server crashed
    handleServerNetworkError(e as { message: string }, dispatch)
    // dispatch(setStatusAppAC({ status: 'failed' }))
    return rejectWithValue(null)
  } finally {
    // dispatch(setStatusAppAC({ status: 'idle' }))
  }
}
