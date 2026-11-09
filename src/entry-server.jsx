// Used only at build time by scripts/prerender.mjs to render the page to static HTML.
import { renderToString } from 'react-dom/server'
import App from './App.jsx'

export function render() {
  return renderToString(<App />)
}
