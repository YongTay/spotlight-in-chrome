import {ChangeEvent, Component, createRef, KeyboardEvent} from 'react'
import {IProps, IState} from '@/types'
import css from './SearchInput.module.css'

class SearchInput extends Component<IProps, IState> {
  private inputRef: React.RefObject<any>;

  constructor(props: IProps) {
    super(props)
    this.state = {
      visible: false,
      search: '',
      inputData: '',
      prefix: '',
      engine: ''
    }
    this.inputRef = createRef()
  }

  onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value:string = e.target.value.trimStart()
    // 保存当前的输入，包括@xxx
    this.setState(() => ({ search: value }))
    if(!this.state.visible && /^@.+ /.test(value)) {
      this.setState(() => ({ visible: true }))
      e.target.value = ''
      let m = value.match(/(^@.+?[ ]).*/) as RegExpMatchArray
      if (m[1]) {
        const mLen = m[1].length
        this.setState(() => {
          return {
            prefix: m[1].trimEnd(),
            // 设置显示的值没有前缀@xxx
            search: value.trimEnd().substring(mLen),
            engine: value.trimEnd().substring(1, mLen - 1)
          }
        })
      }
    }
  }

  onKeyUp = (e: KeyboardEvent) => {
    if(e.code === 'Backspace' || e.key === 'Backspace' || e.keyCode === 8) {
      const search = this.state.search as string
      if(this.state.visible && search.length === 0) {
        this.setState(() => {
            return {
              search: this.state.prefix,
              visible: false,
              prefix: ''
            }
        })
      }
    }
  }

  focus = () => {
    this.inputRef.current.focus()
  }

  componentDidMount() {
    this.focus()
  }

  render() {
    const pl = this.state.visible ? css.pl0 : css.pl
    const { engine, visible} = this.state
    const search = this.state.search as string
    return (
      <div
        className={css.searchWrapper}
      >
        {
          visible && (<div
          className={css.searchEngine}
        >
          <span>{engine}</span>
        </div>)
        }
        <input
          ref={this.inputRef}
          type="text"
          className={pl}
          onInput={this.onInput}
          onKeyUp={this.onKeyUp}
          value={search}
          tabIndex={99}
        />
        {
          !visible && (<div
            className={css.searchEngine}
          >
            <span>bing</span>
          </div>)
        }
      </div>
    )
  }
}

export default SearchInput
