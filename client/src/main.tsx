import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import SocketProvider from './context/socket/SocketProvider.tsx';
import Signin from './pages/SignIn.tsx';
import Signup from './pages/SignUp.tsx';
import QuickSignup from './pages/QuickSignup.tsx';
import { Chat } from './pages/Chat';
import { SupportedsListPage } from './pages/SupportedsListPage.tsx';
import { StyledEngineProvider } from '@mui/material';
import Selection from './pages/Selection.tsx';
import AuthenticationWrapper from './AuthenticationWrapper.tsx';
import './styles/App.scss';
import InfoModalExample from './components/InfoModalExample.tsx';
import Disclaimer from './components/Disclaimer.tsx';

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
  },
  {
    path: '/example',
    element: <InfoModalExample />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <SocketProvider>
      <StyledEngineProvider injectFirst>
        <AuthenticationWrapper>
          <Disclaimer />
          <RouterProvider router={router} />
        </AuthenticationWrapper>
      </StyledEngineProvider>
    </SocketProvider>
  // </React.StrictMode>
);
