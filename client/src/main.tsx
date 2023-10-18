import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import SocketProvider from './context/socket/SocketProvider.tsx';
import Signin from './pages/SignIn.tsx';
import Signup from './pages/SignUp.tsx';
import QuickSignup from './pages/QuickSignup.tsx';
import { Chat } from './pages/Chat';
import { StyledEngineProvider } from '@mui/material';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/signin',

    element: <Signin />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/login',
    element: <QuickSignup />
  },
  {
    path: '/chat',
    element: <Chat />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SocketProvider>
      <StyledEngineProvider injectFirst>
        <RouterProvider router={router} />
      </StyledEngineProvider>
    </SocketProvider>
  </React.StrictMode>
);
