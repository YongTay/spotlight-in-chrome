import React from 'react'
import { Layout } from 'antd'
import css from './App.module.scss'
import SiderMenu from '@/components/SiderMenu/SiderMenu.tsx';
import Main from '@/components/Main/Main.tsx';
import {Outlet} from 'react-router-dom';

const { Sider, Content } = Layout

const App: React.FC = () => {
  return (
    <Layout className={css.full}>
      <Sider className={css.sider}>
        <SiderMenu />
      </Sider>
      <Content className={css.content} >
        <Main>
          <Outlet />
        </Main>
      </Content>
    </Layout>
  )
}

export default App
