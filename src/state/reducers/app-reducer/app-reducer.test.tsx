import { appInitialStatusState } from "../../initialState/appInitialStatusState";
import { appReducer, setErrorAppAC, setStatusAppAC } from "./app-reducer";

test('correct error message should be set', () => {

  const endState = appReducer(appInitialStatusState, setErrorAppAC("New error"))

  expect(endState.error).toBe("New error");
  expect(appInitialStatusState.error).toBe(null);
});


test('correct status should be set', () => {

  const endState = appReducer(appInitialStatusState, setStatusAppAC("succeeded"))

  expect(endState.status).toBe("succeeded");
  expect(appInitialStatusState.status).toBe("idle");
});