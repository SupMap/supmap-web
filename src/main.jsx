import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './components/login/Login.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './components/root/Root.jsx'
import './index.css'
import Register from './components/register/Register.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/login",
        element: <Login />        
      },
      {
        path: "/register",
        element: <Register />
      }      
    ]
  } 
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)