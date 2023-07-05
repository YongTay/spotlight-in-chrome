import { createBrowserRouter } from 'react-router-dom'
import Home from '@/components/Home/Home.tsx';

export default createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/engine',
    element: (<p>engine</p>)
  },
])
