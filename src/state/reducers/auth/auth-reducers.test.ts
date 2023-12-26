import { RequestParamsType } from "../../../api/auth-api"
import { authReducer, loginAC } from "./auth-reducers"

let startState: RequestParamsType

beforeEach(() => {
  startState = {
    email: "",
    password: "",
    rememberMe: false,
    captcha: false
  }
})


test('auth params should be set', () => {
  const data = {
    email: "free@samuraijs.com",
    password: "free",
    rememberMe: true,
    captcha: false
  }

  const endState = authReducer(startState, loginAC(data))

  expect(endState.email).toBe("free@samuraijs.com")
  expect(endState.password).toBe("free")
  expect(endState.rememberMe).toBe(true)
})