import { authReducer, initialParamsAuthType, setIsLoggedInAC } from "./auth-reducers"

let startState: initialParamsAuthType

beforeEach(() => {
  startState = {
    isLoggedIn: false
  }
})


test('auth params should be set', () => {
  const endState = authReducer(startState, setIsLoggedInAC(true))

  expect(endState.isLoggedIn).toBe(true)
  expect(startState.isLoggedIn).toBe(false)
})