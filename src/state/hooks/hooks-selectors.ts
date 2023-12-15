import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { AppDispatchType, AppRootStateType } from "../store";

type DispatchFunc = () => AppDispatchType
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector