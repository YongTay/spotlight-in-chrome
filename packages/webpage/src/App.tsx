import * as React from 'react'
import {IProps, IState, Port, IMessage, IMap, IItem} from '@/types'
import css from './App.module.css'
import SearchInput from '@/components/SearchInput/SearchInput'
import SearchItem from '@/components/SearchItem/SearchItem.tsx'

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

  constructor(props: IProps) {
    super(props)
    this.state = {
      visible: true,
      port: undefined,
      searchList: []
    }
    this.listRef = React.createRef()
    this.searchRef = React.createRef()

    window.addEventListener('keyup', this.handleKeyUp)
    window.addEventListener('keydown', this.handleKeyDown)
  }

  hidePopup = () => {
    this.setState(() => {
      return {
        visible: false
      }
    })
  }

  handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Escape' || e.keyCode === 27 || e.code === 'Escape') {
      this.hidePopup()
    } else if(isUp(e) || isDown(e)) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  handleKeyDown = (e: KeyboardEvent) => {
    if(isUp(e) || isDown(e)) {
      e.preventDefault()
      e.stopPropagation()
    }
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
    const port: Port = chrome.runtime.connect({ name: 'spotlight' })
    port.postMessage({
      type: 'register',
      value: true
    })
    port.onMessage.addListener((msg: IMap) => {
      msg = msg as IMessage
      console.log(msg)
      switch (msg.type) {
        case 'visible':
          this.setState(() => ({ visible: true }))
          break
        case 'result':
          this.setState(() => ({searchList: msg.value}))
      }
    })
    this.setState(() => {
      return {
        port: port
      }
    })
  }

  onInput = (value: string) => {
    const port = this.state.port as Port
    port.postMessage({
      type: 'search',
      value: value
    })
  }

  closeTab = (data: IItem) => {
    this.state.port?.postMessage({
      type: 'closeTab',
      value: data
    })
    this.setState(() => {
      return {searchList : this.state.searchList?.filter(i => i !== data)}
    })
  }

  render() {
    const list = this.state.searchList as Array<any>
    return (
      this.state.visible && <div
        className={css.container}
        onKeyUp={this.handleFocus}
      >
        <div
          className={css.popup}
        >
          <SearchInput
            ref={this.searchRef}
            onInput={this.onInput}
          />
          <div
            className={css.list}
            ref={this.listRef}
          >
            {
              list.map((item, i) => <SearchItem
                itemData={item}
                clickType={this.closeTab}
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
