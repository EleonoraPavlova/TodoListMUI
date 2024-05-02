import { appInitial } from 'BLL/initialState'
import { appReducer, setErrorAppAC } from './appSlice'

test('correct error message should be set', () => {
  const endState = appReducer(appInitial, setErrorAppAC({ error: 'New error' }))

  expect(endState.error).toBe('New error')
  expect(appInitial.error).toBe(null)
})
