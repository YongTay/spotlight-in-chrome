import {createBrowserRouter} from 'react-router-dom'
import App from '../App.tsx'
import MetaWrapper from '@/components/MetaWrapper/MetaWrapper.tsx';
import Home from '@/components/Home/Home.tsx';

export default createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: 'home',
        element: (<MetaWrapper title='home' name="HOME"> <Home /> </MetaWrapper>)
      },
      {
        path: 'engine',
        element: (<MetaWrapper title="engine" name="搜索引擎"><p>ENGINE</p></MetaWrapper>)
      },
      {
        path: 'about',
        element: (<MetaWrapper title="about" name="关于"><p>ABOUT</p></MetaWrapper>)
      }
    ]
  },
])
