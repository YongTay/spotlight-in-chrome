
export interface IProps {
  tabIndex?: number | undefined
}

export interface IState {
  visible?: boolean,
  port?: chrome.runtime.Port | undefined
  search?: string
  inputData?: string,
  prefix?: string,
  engine?: string
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
