import React from 'react';
import {IProps, IState} from '@/types.ts'
import css from './Main.module.scss'



class Main extends React.Component<IProps & {
  children: React.ReactNode
}, IState & {

}>{

  render() {
    return (
      <div className={css.main}>
        {this.props.children}
      </div>
    )
  }
}

export default Main
