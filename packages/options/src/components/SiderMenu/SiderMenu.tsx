import React, {Key, ReactElement, ReactNode } from 'react';
import {IMetaWrapperProps, IProps, IState} from '@/types.ts'
import router from '@/router/router.tsx';
import {Menu, MenuProps} from 'antd';
import {RouteObject, useNavigate} from 'react-router-dom'
import css from './SiderMenu.module.scss'

function getRouterMeta(router: RouteObject, prop: keyof IMetaWrapperProps): IMetaWrapperProps[keyof IMetaWrapperProps] {
  const element = router.element as ReactElement<IMetaWrapperProps>
  return element.props[prop]
}

function getItem(
  label: ReactNode,
  key: Key
): Record<string, any> {
  return {
    label,
    key
  }
}


function routerToItems(data: Array<RouteObject>) {
  const items: Array<Record<string, any>> = []
  data.forEach((row: RouteObject) => {
    const item = getItem(
      getRouterMeta(row, 'name'),
      row.path as string
    )
    items.push(item)
  })
  return items
}

const Nav: React.FC<{items: any}> = (props) => {
  const navigate = useNavigate()
  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key)
  }
  return (
    <Menu
      className={css.menu}
      onClick={onClick}
      mode="inline"
      items={props.items}
    />
  )
}

class SiderMenu extends React.Component <IProps & {}, IState & {
  items: Record<string, any>[]
}> {
  constructor(props: IProps & {}) {
    super(props);
    const menus = routerToItems(router.routes[0].children as Array<RouteObject>)
    this.state = {
      items: menus
    }
  }

  render() {
    const items = this.state.items as any
    return (
      <Nav items={items} />
    )
  }
}

export default SiderMenu
