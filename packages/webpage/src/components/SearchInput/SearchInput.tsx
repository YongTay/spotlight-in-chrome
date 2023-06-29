import {Component, FormEvent, KeyboardEvent} from 'react'
import {IProps, IState} from '@/types'
import css from './SearchInput.module.css'

class SearchInput extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      visible: false,
      search: '',
      inputData: '',
      prefix: ''
    }
  }

  onInput = (e: FormEvent) => {
    const value = e.target.value.trimStart()
    // 保存当前的输入，包括@xxx
    this.setState(() => ({ search: value }))
    if(!this.state.visible && /^@.+ /.test(value)) {
      this.setState(() => ({ visible: true }))
      e.target.value = ''
      let m = value.match(/(^@.+?[ ]).*/)
      if (m[1]) {
        this.setState(() => {
          return {
            prefix: m[1].trimEnd(),
            // 设置显示的值没有前缀@xxx
            search: value.trimEnd().substring(m[1].length)
          }
        })
      }
    }
  }

  onKeyUp = (e: KeyboardEvent) => {
    if(e.code === 'Backspace' || e.key === 'Backspace' || e.keyCode === 8) {
      const search = this.state.search as string
      if(this.state.visible && search.length === 0) {
        this.setState(() => ({ search: this.state.prefix }))
      }
    }
  }

  render() {
    const pl = this.state.visible ? css.pl0 : css.pl
    const search = this.state.search as string
    return (
      <div
        className={css.searchWrapper}
      >
        {
          this.state.visible && (<div
          className={css.searchEngine}
        >
          <span>bing</span>
        </div>)
        }
        <input
          type="text"
          className={pl}
          onInput={this.onInput}
          onKeyUp={this.onKeyUp}
          value={search}
        />
        <div
          className={css.searchEngine}
        >
          <span>bing</span>
        </div>
      </div>
    )
  }
}

export default SearchInput
