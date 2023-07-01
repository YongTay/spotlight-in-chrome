import {Component} from 'react'
import {IItem, IProps, IState} from '@/types.ts'
import css from './SearchItem.module.css'

class SearchItem extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
  }
  render() {
    const tabIndex = this.props.tabIndex as number
    const itemData = this.props.itemData as IItem
    return (
      <div
        tabIndex={tabIndex}
        className={css.item}
      >
        <p
          className={css.title}
        >{itemData.url}</p>
        <p
          className={css.url}
        >{itemData.title}</p>
      </div>
    )
  }
}

export default SearchItem
