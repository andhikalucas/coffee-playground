import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/anton/400.css'
import '@fontsource/patrick-hand/400.css'
import '@fontsource/caveat/400.css'
import '@fontsource/caveat/700.css'
import './styles/global.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
