import {Component} from 'react'
import {IProps, IState, Port, IMessage} from '@/types'
import css from './App.module.css'
import SearchInput from '@/components/SearchInput/SearchInput'

class App extends Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      visible: true,
      port: undefined
    }
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
      >
        <div
          className={css.popup}
        >
          <SearchInput />
        </div>
        <div
          className={css.mask}
          onClick={this.hidePopup}
        ></div>
      </div>
    )
  }
}

export default App
