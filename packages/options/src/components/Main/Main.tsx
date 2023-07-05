import React from 'react';
import {IProps, IState} from '@/types.ts'



class Main extends React.Component<IProps & {
  children: React.ReactNode
}, IState & {

}>{

  render() {
    return (
      <div>
        <p>MAIN</p>
        {this.props.children}
      </div>
    )
  }
}

export default Main
