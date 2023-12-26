import React from 'react';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { createRoot } from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import App from "./apps/App";
import { Provider } from "react-redux";
import { store } from "./state/store";
import { HashRouter } from "react-router-dom";


const container = document.getElementById('root') as HTMLElement
const root = createRoot(container);
root.render(
  <HashRouter>
    <Provider store={store}>
      <App demo={false} />
    </Provider>
  </HashRouter>
);


serviceWorker.unregister();