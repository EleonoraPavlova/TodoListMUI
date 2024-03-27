import { appInitial } from 'BLL/initialState'
import { appReducer, setErrorAppAC, setStatusAppAC } from './appSlice'

test('correct error message should be set', () => {
  const endState = appReducer(appInitial, setErrorAppAC({ error: 'New error' }))

  expect(endState.error).toBe('New error')
  expect(appInitial.error).toBe(null)
})

test('correct status should be set', () => {
  const endState = appReducer(appInitial, setStatusAppAC({ status: 'succeeded' }))

  expect(endState.status).toBe('succeeded')
  expect(appInitial.status).toBe('idle')
})
