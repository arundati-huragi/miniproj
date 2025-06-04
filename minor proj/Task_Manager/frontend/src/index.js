import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from "react-redux"
import store from './redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TaskProvider } from './context/TaskContext.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastContainer bodyStyle={{ fontFamily: "Roboto" }} />
    <Provider store={store}>
      <TaskProvider>
        <App />
      </TaskProvider>
    </Provider>
  </React.StrictMode>
);
