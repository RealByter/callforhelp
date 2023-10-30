import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import Signin from './pages/SignIn.tsx';
import Signup from './pages/SignUp.tsx';
import QuickSignup from './pages/QuickSignup.tsx';
import { Chat } from './pages/Chat';
import { SupportedsListPage } from './pages/SupportedsListPage.tsx';
import { StyledEngineProvider } from '@mui/material';
import Selection from './pages/Selection.tsx';
import AuthenticationWrapper from './AuthenticationWrapper.tsx';
import './styles/App.scss';
import Disclaimer from './components/Disclaimer.tsx';
import OpenContactSlip from './components/OpenContactSlip.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <QuickSignup />
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
    path: '/chat',
    element: <Chat />
  },
  {
    path: '/supportedsList',
    element: <SupportedsListPage />
  },
  {
    path: '/FindSupporter', //there is a to link here from SwitchRoleLink component
    element: <div>temp find supporter</div>
  },
  {
    path: '/selection',
    element: <Selection />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <StyledEngineProvider injectFirst>
    <AuthenticationWrapper>
      <Disclaimer />
      <OpenContactSlip />
      <RouterProvider router={router} />
    </AuthenticationWrapper>
  </StyledEngineProvider>
  // </React.StrictMode>
);
