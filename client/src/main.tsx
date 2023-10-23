import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import SocketProvider from './context/socket/SocketProvider.tsx';
import Signin from './pages/SignIn.tsx';
import Signup from './pages/SignUp.tsx';
import QuickSignup from './pages/QuickSignup.tsx';
import { Chat } from './pages/Chat';
import { StyledEngineProvider } from '@mui/material';
import Selection from './pages/Selection.tsx';
import AuthenticationWrapper from './AuthenticationWrapper.tsx';
import './styles/App.scss';
import InfoModal from './components/InfoModal.tsx';

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
    path: '/selection',
    element: <Selection />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SocketProvider>
      <StyledEngineProvider injectFirst>
        <AuthenticationWrapper>
          {/* <RouterProvider router={router} /> */}
          <InfoModal
            title="מה כדאי לדעת כתומך"
            subtext="הנה מספר דגשים ונקודות שכדאי לשים לב אליהם במהלך שיחה ">
            <></>
          </InfoModal>
        </AuthenticationWrapper>
      </StyledEngineProvider>
    </SocketProvider>
  </React.StrictMode>
);
