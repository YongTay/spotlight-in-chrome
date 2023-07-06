import React from 'react';
import {IProps} from '@/types.ts'
import {NavLink} from 'react-router-dom';



const SiderMenu: React.FC<IProps & {
}> = () => {
  return (
    <div>
      <ul>
        <li>
          <NavLink to={'home'}>home</NavLink>
        </li>
        <li>
          <NavLink to={'engine'}>engine</NavLink>
        </li>
        <li>
          <NavLink to={'contact'}>contact</NavLink>
        </li>
      </ul>
    </div>
  )
}

export default SiderMenu
