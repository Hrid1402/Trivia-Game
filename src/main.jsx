import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.jsx'
import './index.css'
import AI_Trivia from './AI_Trivia.jsx'
import BigShow from './BigShow.jsx';
import ErrorPage from './ErrorPage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/BigShow",
    element: <BigShow/>,
  },
  {
    path: "/AI-Trivia",
    element: <AI_Trivia/>
  },
  {
    path: "*",
    element: <ErrorPage/>,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
