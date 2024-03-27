import React from 'react'
import './style/fonts'
import './style/index.css'
import * as serviceWorker from './serviceWorker'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { store } from './BLL/store'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
root.render(
  <HashRouter>
    <Provider store={store}>
      <App demo={false} />
    </Provider>
  </HashRouter>
)

serviceWorker.unregister()
