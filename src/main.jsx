import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppShell from './app/AppShell.jsx'
import { getEffectiveReliabilityPolicy } from './config/policyConfig.js'

console.info('[runtime-policy] effective reliability policy', getEffectiveReliabilityPolicy())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppShell />
  </StrictMode>,
)
