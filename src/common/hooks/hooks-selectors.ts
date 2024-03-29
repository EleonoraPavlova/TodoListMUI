import { AppDispatch, AppRootState } from 'BLL/store'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'

type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector
