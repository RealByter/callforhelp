import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import SocketProvider from './context/socket/SocketProvider.tsx';
// import SignUpPage from './pages/SignUp.tsx';
// import SignInPage from './pages/SignIn.tsx';
import Signin from './components/SecondVersion/Signin.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  // {
  //   path: '/signup',
  //   element: <SignUpPage />
  // },
  // {
  //   path: '/signin',
  //   element: <SignInPage />
  // },
  {
    path: '/signin',
    element: <Signin />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  </React.StrictMode>
);
