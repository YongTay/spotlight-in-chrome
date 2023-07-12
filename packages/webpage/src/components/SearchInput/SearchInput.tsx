import {ChangeEvent, Component, createRef, KeyboardEvent} from 'react'
import {ISearchInputProps, IState} from '@/types'
import css from './SearchInput.module.css'

class SearchInput extends Component<ISearchInputProps, IState> {
  private inputRef: React.RefObject<any>;

  constructor(props: ISearchInputProps) {
    super(props)
    this.state = {
      visible: false,
      search: '',
      inputData: '',
      prefix: '',
      engine: '',
    }
    this.inputRef = createRef()
  }

  clearSearch() {
    this.setState(() => ({search: ''}))
  }

  onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value:string = e.target.value.trimStart()

    // 保存当前的输入，包括@xxx
    this.setState(() => ({ search: value }))
    if(!this.state.visible && /^@.+ /.test(value)) {
      let m = value.match(/(^@.+?[ ]).*/) as RegExpMatchArray
      if (m[1]) {
        const mLen = m[1].length
        const engine = value.trimEnd().substring(1, mLen - 1)
        // @ts-ignore
        if (this.props.engines[engine]) {
          this.setState(() => ({ visible: true }))
          e.target.value = ''
          const search = value.trimEnd().substring(mLen)
          this.setState(() => {
            return {
              prefix: m[1].trimEnd(),
              // 设置显示的值没有前缀@xxx
              search,
              engine
            }
          })
          this.props.onInput(search)
          return
        }
      }
    }
    this.props.onInput(value.trim())
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
    } else if(e.code === 'Enter' || e.key === 'Enter' || e.keyCode === 13) {
      this.props.onEnter(e, this.state)
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
          autoFocus={true}
        />
        {
          !visible && (<div
            className={css.searchEngine}
          >
            <span>{this.props.defaultEngine}</span>
          </div>)
        }
      </div>
    )
  }
}

export default SearchInput
