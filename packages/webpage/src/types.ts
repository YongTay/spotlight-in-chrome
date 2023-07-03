import {KeyboardEvent} from 'react';

export interface IItem {
  title?: string,
  url?: string,
  type?: string,
  index?: number
}

export interface IProps {
  tabIndex?: number | undefined,
  itemData?: IItem,
}

export interface ISearchInputProps extends IProps {
  onInput: (value: string) => void,
  onKeyUp: (e: KeyboardEvent, state: IState) => void
}

export interface IItemProps extends IProps {
  clickType: (info: IItem) => void,
  onKeyUp: (e: KeyboardEvent | any, state?: IItem) => void
}

export interface IState {
  visible?: boolean,
  port?: Port | undefined
  search?: string
  inputData?: string,
  prefix?: string,
  engine?: string,
  searchList?: Array<any>
}

// 对象的任意类型
export interface IMap {
  [prop: string]: any
}

// 一般的信息类型
export interface Message {
  type: string,
  value: any
}

export interface Port extends chrome.runtime.Port {
  postMessage: (message: IMessage | Message) => void,
  onMessage: chrome.runtime.PortMessageEvent;
}

// 扩展的信息类型
export type IMessage = Message & IMap

export default {}
