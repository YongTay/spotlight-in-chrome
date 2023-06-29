import {Component} from 'react'
import { IProps, IState } from '@/types.ts'
import css from './SearchItem.module.css'

class SearchItem extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
  }
  render() {
    const { tabIndex} = this.props
    return (
      <div
        tabIndex={tabIndex}
        className={css.item}
      >
        <p>12344</p>
      </div>
    )
  }
}

export default SearchItem
