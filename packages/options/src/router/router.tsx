import {createBrowserRouter} from 'react-router-dom'
import App from '../App.tsx'

export default createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: 'home',
        element: <p>HOME</p>
      },
      {
        path: 'engine',
        element: (<p>ENGINE</p>)
      },
      {
        path: '/contact',
        element: <p>CONTACT</p>
      }
    ]
  },
])
