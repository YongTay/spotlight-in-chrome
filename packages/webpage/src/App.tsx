import * as React from 'react'
import {IProps, IState, IItem} from '@/types'
import css from './App.module.css'
import SearchInput from '@/components/SearchInput/SearchInput'
import SearchItem from '@/components/SearchItem/SearchItem.tsx'
// @ts-ignore
import { Connector } from '@spotlight/events'

function isUp(e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) {
  return (e.key === 'ArrowUp' || e.keyCode === 38 || e.code === 'ArrowUp')

}

function isDown(e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) {
  return (e.key === 'ArrowDown' || e.keyCode === 40 || e.code === 'ArrowDown')
}

function isTab(e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) {
  return (e.key === 'Tab' || e.keyCode === 40 || e.code === 'ArrowDown')
}

class App extends React.Component<IProps, IState> {
  private listRef: React.RefObject<any>;
  private searchRef: React.RefObject<any>;
  // @ts-ignore
  private connector: Connector;

  constructor(props: IProps) {
    super(props)
    this.state = {
      visible: false,
      searchList: []
    }
    this.listRef = React.createRef()
    this.searchRef = React.createRef()

    window.addEventListener('keyup', this.handleKeyUp)
    window.addEventListener('keydown', this.handleKeyDown)

    const connector: Connector = new Connector('spotlight')
    this.connector = connector
  }

  hidePopup = () => {
    this.setState(() => ({ visible: false, searchList: [] }))
    setTimeout(() => {
      this.setState(() => ({ visible: false }))
    })
  }

  handleKeyUp = (e: KeyboardEvent | any) => {
    if (e.key === 'Escape' || e.keyCode === 27 || e.code === 'Escape') {
      this.hidePopup()
    } else if(isUp(e) || isDown(e)) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  handleKeyDown = (e: KeyboardEvent | any) => {
    this.handleKeyUp(e)
  }

  handleFocus = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if(isDown(e)) {
      const list = [...this.listRef.current.childNodes]
      const len = list.length
      const index = list.findIndex((ele: any) => ele === e.target)
      if (index === -1) {
        list[0].focus()
      } else if(index + 1 < len) {
        list[index+1].focus()
      } else {
        list[0].focus()
      }
    } else if(isUp(e)) {
      const list = [...this.listRef.current.childNodes]
      const len = list.length
      const index = list.findIndex((ele: any) => ele === e.target)
      if(index === -1) {
        list[0].focus()
      } else if(index - 1 >= 0) {
        list[index-1].focus()
      } else {
        list[len-1].focus()
      }
    } else if(isTab(e)) {
      this.searchRef.current.focus()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  componentDidMount() {
    this.connector.onVisible(() => {
      this.setState(() => ({ visible: true }), () => {
        this.searchRef.current.focus()
      })
    })
  }

  onInput = (value: string) => {
    this.connector.search({
      value: value
    }, (result: any) => {
      console.log(result)
    })
  }

  closeTab = (data: IItem) => {
    this.connector.closeTab(data)
    this.setState(() => {
      return {searchList : this.state.searchList?.filter(i => i !== data)}
    })
  }

  searchEnter = (e: React.KeyboardEvent, state: IState | undefined) => {
    if(e.code === 'Enter' || e.key === 'Enter' || e.keyCode === 13) {
      this.hidePopup()
      this.connector.search({
        value: state?.search,
        engine: state?.engine || 'bing'
      })
    }
  }

  itemEnter = (e: React.KeyboardEvent, data: IItem | undefined) => {
    if(e.code === 'Enter' || e.key === 'Enter' || e.keyCode === 13) {
      this.hidePopup()
      if (data?.type === 'tab') {
        this.connector.highlightTab({ index: data.index })
      } else {
        this.connector.newTab({ url: data?.url })
      }
    }
  }

  render() {
    const list = this.state.searchList as Array<any>
    const visible = this.state.visible
    return (
       <div
        className={css.container}
        onKeyUp={this.handleFocus}
        style={{ display: visible ? 'block' : 'none'}}
      >
        <div
          className={css.popup}
        >
          <SearchInput
            ref={this.searchRef}
            onInput={this.onInput}
            onKeyUp={this.searchEnter}
          />
          <div
            className={css.list}
            ref={this.listRef}
          >
            {
              list.map((item, i) => <SearchItem
                itemData={item}
                clickType={this.closeTab}
                onKeyUp={this.itemEnter}
                tabIndex={i+100}/>)
            }
          </div>
        </div>
        <div
          className={css.mask}
          onClick={this.hidePopup}
        >
        </div>
      </div>
    )
  }
}

export default App
