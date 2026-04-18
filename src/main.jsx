import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Stale-tab recovery: after a deploy, a user's already-open tab references
// the previous build's chunk filenames. When it dynamic-imports a route,
// the request 404s (old hash gone) and Vite fires `vite:preloadError`.
// We reload once so the browser picks up the new index.html + new chunks.
// sessionStorage guard prevents infinite loops if the chunk truly doesn't
// exist for a different reason (network outage, CDN failure, etc.).
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    if (!sessionStorage.getItem('rb:reloaded-once')) {
      sessionStorage.setItem('rb:reloaded-once', '1')
      event.preventDefault()
      window.location.reload()
    }
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
