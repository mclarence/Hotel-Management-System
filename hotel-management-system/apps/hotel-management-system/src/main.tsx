import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import {store} from './app/redux/store';
import { Provider } from 'react-redux';
import App from './app/app';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>
);
