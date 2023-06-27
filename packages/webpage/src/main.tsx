import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

if(import.meta.env.MODE === 'development') {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} else {
  const div = document.createElement('div')
  div.id = 'spotlight-extensions-root'
  const props = {
    position: 'fixed',
    top: 0,
    left: 0
  }
  for(const k in props) {
    div.style[k] = props[k]
  }
  window.document.appendChild(div)
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

