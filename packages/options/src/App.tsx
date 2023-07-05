import React from 'react'
import { Layout } from 'antd'
import css from './App.module.scss'
import router from '@/router/router.tsx'
import {RouterProvider} from 'react-router-dom';
import SiderMenu from '@/components/SiderMenu/SiderMenu.tsx';
import Main from '@/components/Main/Main.tsx';

const { Sider, Content } = Layout

const App: React.FC = () => {

  return (
    <Layout className={css.full}>
      <Sider className={css.sider}>
        <SiderMenu />
      </Sider>
      <Content className={css.content} >
        <Main>
          <RouterProvider router={router} />
        </Main>
      </Content>
    </Layout>
  )
}

export default App
