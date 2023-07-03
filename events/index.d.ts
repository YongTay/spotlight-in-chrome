
declare interface Message {
  type: string,
  value: any
}

declare class backgroundEvent {
  onRegister(cb: (message: Message, port: chrome.runtime.Port) => void)
  onSearch: (cb: (message: Message) => Array<any>) => void
}

declare class pageEvent {
  constructor(name: string)
  connect: () => void
  pong:(message: Message, port: chrome.runtime.Port) => void
  register: () => void
  onVisible: () => void
}
