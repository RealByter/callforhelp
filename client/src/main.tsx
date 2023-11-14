import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import Signin from './pages/SignIn.tsx';
import Signup from './pages/SignUp.tsx';
import QuickSignup from './pages/QuickSignup.tsx';
import {SupporteeChatPage } from './pages/SupporteeChatPage.tsx';
import { ChatsListPage } from './pages/ChatsListPage.tsx';
import { StyledEngineProvider } from '@mui/material';
import Selection from './pages/Selection.tsx';
import AuthenticationWrapper from './AuthenticationWrapper.tsx';
import './styles/App.scss';
import InfoModalExample from './components/InfoModalExample.tsx';
import Disclaimer from './components/Disclaimer.tsx';
import ErrorContextProvider from './context/Error/ErrorContextProvider.tsx';
import { SupporterChatPage } from './pages/SupporterChatPage.tsx';

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
    path: '/supporter-chat',
    element: <SupporterChatPage />
  },
  {
    path: '/supportee-chat',
    element: <SupporteeChatPage />
  },
  {
    path: '/chats',
    element: <ChatsListPage />
  },
  {
    path: '/selection',
    element: <Selection />
  },
  {
    path: '/example',
    element: <InfoModalExample />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <StyledEngineProvider injectFirst>
    <ErrorContextProvider>
      <AuthenticationWrapper>
        <Disclaimer />
        <RouterProvider router={router} />
      </AuthenticationWrapper>
    </ErrorContextProvider>
  </StyledEngineProvider>
  // </React.StrictMode>
);
