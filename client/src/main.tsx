import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import SocketProvider from './context/socket/SocketProvider.tsx';
import SignUpPage from './pages/SignUp.tsx';
import SignInPage from './pages/SignIn.tsx';
import ExampleForm from './components/ExampleForm.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/signup',
    element: <SignUpPage />
  },
  {
    path: '/signin',
    element: <SignInPage />
  },
  {
    path: '/test',
    element: <ExampleForm />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  </React.StrictMode>
);
