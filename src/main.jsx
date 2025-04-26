import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './components/root/Root.jsx'
import './index.css'
import HomePage from './components/homePage/HomePage.jsx'
import Stats from './components/stats/Stats.jsx';
import ErrorBoundary from './components/ErrorBoundary/errorBoundary.jsx'

const hash = window.location.hash
if (hash.startsWith('#token=')) {
  const token = hash.substring(7)
  localStorage.setItem('token', "Bearer " + token)
  window.history.replaceState(null, '', window.location.pathname + window.location.search)
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path:"/", element: <HomePage /> },
      { path: "/stats", element: <Stats /> },
      { path: "*", element: <ErrorBoundary /> }
    ]
  }
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
)
