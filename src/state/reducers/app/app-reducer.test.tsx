import { InitialStateApp, appReducer, setErrorAppAC, setStatusAppAC } from "./app-reducer";

test('correct error message should be set', () => {

  const endState = appReducer(InitialStateApp, setErrorAppAC("New error"))

  expect(endState.error).toBe("New error");
  expect(InitialStateApp.error).toBe(null);
});


test('correct status should be set', () => {

  const endState = appReducer(InitialStateApp, setStatusAppAC("succeeded"))

  expect(endState.status).toBe("succeeded");
  expect(InitialStateApp.status).toBe("idle");
});