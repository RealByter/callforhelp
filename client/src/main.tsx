import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import SocketProvider from "./context/socket/SocketProvider.tsx";
import './fonts/Assistant.ttf';
import { PageExample } from "./pages/PageExample";
import { Chat } from "./pages/Chat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // children: [
    //   {
    //     path: "/ex",
    //     element: <PageExample />,
    //     // loader: teamLoader,
    //   },
    // ],
  },{
    path: "/ex",
    element: <PageExample />,
    // loader: teamLoader,
  }, {
    path: "/chat",
    element: <Chat />
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  </React.StrictMode>
);
