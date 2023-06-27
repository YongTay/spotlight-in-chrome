import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

if(import.meta.env.MODE === 'development') {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} else {

  window.addEventListener('beforeunload', () => {

    chrome.runtime?.sendMessage && chrome.runtime.sendMessage({
      reload: true
    }).then(res => {
      if(res.finish) {
        console.log('finish reload')
      }
    })
  })
  const div: HTMLElement = document.createElement('div')
  div.id = 'spotlight-extensions-root'
  div.style.position = 'fixed'
  div.style.top = '0'
  div.style.left = '0'
  window.document.body.appendChild(div)
  ReactDOM.createRoot(document.getElementById('spotlight-extensions-root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

