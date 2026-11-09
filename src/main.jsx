import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/google-sans-flex/wdth.css'
import '@fontsource-variable/google-sans-code'
import './styles.css'
import App from './App.jsx'

const root = document.getElementById('root')
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
// The production build prerenders the page into #root (for SEO), so hydrate it; in dev it's empty.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
