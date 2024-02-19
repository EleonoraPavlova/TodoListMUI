import { authReducer, setIsLoggedInAC } from "./auth-reducers"

type startAuthType = {
  isLoggedIn: false
}

let startState: startAuthType;

beforeEach(() => {
  startState = {
    isLoggedIn: false
  }
})


test('auth params should be set', () => {
  const endState = authReducer(startState, setIsLoggedInAC({ isLoggedIn: true }))

  expect(endState.isLoggedIn).toBe(true)
  expect(startState.isLoggedIn).toBe(false)
})