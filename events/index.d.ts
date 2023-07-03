
declare interface Message {
  type: string,
  value: any
}

declare class Listener {
  onRegister(cb: (message: Message, port: chrome.runtime.Port) => void)
  onSearch: (cb: (message: Message) => Array<any>) => void
}

declare class Connector {
  constructor(name: string)
  connect: () => void
  pong:(message: Message, port: chrome.runtime.Port) => void
  register: () => void
  onVisible: () => void
}
