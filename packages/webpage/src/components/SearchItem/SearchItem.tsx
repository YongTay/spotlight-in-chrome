import {Component, KeyboardEvent} from 'react'
import {IItem, IItemProps, IState} from '@/types.ts'
import css from './SearchItem.module.css'

class SearchItem extends Component<IItemProps, IState> {
  constructor(props: IItemProps) {
    super(props)
  }
  onClick = () => {
    this.props.clickType(this.props.itemData as IItem)
  }

  handleKeyUp = (e: KeyboardEvent) => {
    this.props.onKeyUp(e, this.props.itemData)
  }

  render() {
    const tabIndex = this.props.tabIndex as number
    const itemData = this.props.itemData as IItem
    return (
      <div
        tabIndex={tabIndex}
        className={css.item}
        onKeyUp={this.handleKeyUp}
      >
        <div
          className={css.title}
        >
          <p>{itemData.title}</p>
          <p
            className={itemData.type === 'tab' ? css.close : ''}
            onClick={this.onClick}
          >{itemData.type}</p>
        </div>
        <p
          className={css.url}
        >{itemData.url}</p>
      </div>
    )
  }
}

export default SearchItem
