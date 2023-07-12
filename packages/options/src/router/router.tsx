import {createHashRouter} from 'react-router-dom'
import App from '../App.tsx'
import MetaWrapper from '@/components/MetaWrapper/MetaWrapper.tsx';
import Home from '@/components/Home/Home.tsx';
import EngineSetting from '@/views/Setting/Engine/Engine.tsx'
import Bookmarks from '@/views/Setting/Bookmarks/Bookmarks.tsx'
export default createHashRouter([
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
        element: (<MetaWrapper title="engine" name="搜索引擎"><EngineSetting /></MetaWrapper>)
      },
      {
        path: 'bookmarks',
        element: (<MetaWrapper title="bookmarks" name="书签"><Bookmarks /></MetaWrapper>)
      },
      {
        path: 'about',
        element: (<MetaWrapper title="about" name="关于"><p>ABOUT</p></MetaWrapper>)
      }
    ]
  },
])
