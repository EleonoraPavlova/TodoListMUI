import { authReducer, setIsLoggedInAC } from './authSlice'

type startAuth = {
  isLoggedIn: false
}

let startState: startAuth

beforeEach(() => {
  startState = {
    isLoggedIn: false,
  }
})

test('auth params should be set', () => {
  const endState = authReducer(startState, setIsLoggedInAC({ isLoggedIn: true }))

  expect(endState.isLoggedIn).toBe(true)
  expect(startState.isLoggedIn).toBe(false)
})
