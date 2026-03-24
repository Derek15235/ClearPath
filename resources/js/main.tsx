import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/routes'
import { initAuth } from './stores/authStore'
import './styles/globals.css'

// Initialize auth state before first render.
// This ensures loading:false and session resolved before RequireAuth evaluates.
// Prevents any flash of PageSkeleton on refresh for already-authenticated users.
initAuth().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
})
