import * as React from 'react'
import {IProps, IState, Port, IMessage} from '@/types'
import css from './App.module.css'
import SearchInput from '@/components/SearchInput/SearchInput'
import SearchItem from '@/components/SearchItem/SearchItem.tsx'

function isUp(e: React.KeyboardEvent<HTMLDivElement>) {
  return (e.key === 'ArrowUp' || e.keyCode === 38 || e.code === 'ArrowUp')

}

function isDown(e: React.KeyboardEvent<HTMLDivElement>) {
  return (e.key === 'ArrowDown' || e.keyCode === 40 || e.code === 'ArrowDown')
}

function isTab(e: React.KeyboardEvent<HTMLDivElement>) {
  return (e.key === 'Tab' || e.keyCode === 40 || e.code === 'ArrowDown')
}

class App extends React.Component<IProps, IState> {
  private listRef: React.RefObject<any>;
  private searchRef: React.RefObject<any>;

  constructor(props: IProps) {
    super(props)
    this.state = {
      visible: true,
      port: undefined
    }
    this.listRef = React.createRef()
    this.searchRef = React.createRef()

    window.addEventListener('keyup', this.handleKeyUp)
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
    }
  }

  handleFocus = (e: React.KeyboardEvent<HTMLDivElement>) => {
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
  }

  componentDidMount() {
    const port: Port = chrome.runtime.connect({ name: 'spotlight' })
    port.postMessage({
      type: 'register',
      value: true
    })
    port.onMessage.addListener((msg: any) => {
      msg = msg as IMessage
      console.log(msg)
      switch (msg.type) {
        case 'visible':
          this.setState(() => ({ visible: true }))
      }
    })
    this.setState(() => {
      return {
        port: port
      }
    })
  }

  render() {
    return (
      this.state.visible && <div
        className={css.container}
        onKeyUp={this.handleFocus}
      >
        <div
          className={css.popup}
        >
          <SearchInput ref={this.searchRef} />
          <div
            className={css.list}
            ref={this.listRef}
          >
            {
              Array.from({ length: 10 })
                .map((_, i) => <SearchItem
                  itemData={{title: '1213213', url: '223213', type: '2'}}
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
