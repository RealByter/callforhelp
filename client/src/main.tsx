import React from 'react';
import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import Signin from './pages/SignIn.tsx';
import Signup from './pages/SignUp.tsx';
import QuickSignup from './pages/QuickSignup.tsx';
import { Chat } from './pages/Chat';
import { ChatsListPage } from './pages/ChatsListPage.tsx';
import { StyledEngineProvider } from '@mui/material';
import Selection from './pages/Selection.tsx';
import AuthenticationWrapper from './AuthenticationWrapper.tsx';
import './styles/App.scss';
import InfoModalExample from './components/InfoModalExample.tsx';
import Disclaimer from './components/Disclaimer.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <StyledEngineProvider injectFirst>
    <Disclaimer />
    <BrowserRouter>
      <AuthenticationWrapper>
        <Routes>
          <Route path="/" element={<QuickSignup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chats" element={<ChatsListPage />} />
          <Route path="/selection" element={<Selection />} />
          <Route path="/example" element={<InfoModalExample />} />
        </Routes>
      </AuthenticationWrapper>
    </BrowserRouter>
  </StyledEngineProvider>
  // </React.StrictMode>
);
