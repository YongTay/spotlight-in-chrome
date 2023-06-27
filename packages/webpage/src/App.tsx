import {Component} from 'react'
import { IProps, IState } from '../types.ts'
import css from './App.module.css'

class App extends Component<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      visible: true
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

  render() {
    return (
      this.state.visible && <div
        className={css.container}
      >
        <div
          className={css.popup}
        >
          <div
            className={css.searchWrapper}
          >
            <input/>
          </div>
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
