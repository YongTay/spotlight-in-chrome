
const EventType = {
  register: 'register',
  ping: 'ping',
  pong: 'pong',
  visible: 'visible',
  search: 'search',
  result: 'result',
  closeTab: 'closeTab',
  highlightTab: 'highlightTab',
  newTab: 'newTab'
}

function empty() {}

export class backgroundEvent {
  constructor(name) {
    this.name = name
  }

  connect() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      this.port = chrome.tabs.connect(tabs[0].id, {name: this.name})
      this.ping()
      this.listen()
    })
  }

  _postMessage(message) {
    if(typeof message === 'string') {
      this.port.postMessage({
        type: message,
        value: message
      })
    } else {
      this.port.postMessage(message)
    }
  }

  // 发送
  visible() {
    this._postMessage({
      type: EventType.visible,
      value: true
    })
  }

  result(data) {
    this._postMessage({
      type: EventType.result,
      value: data
    })
  }

  // 监听
  _listen() {
    this.register = empty
    this.search = empty
    this.closeTab = empty
    this.highlightTab = empty
    this.newTab = empty
  }
  onRegister(cb) {
    this.register = (data) => {
      const fn = cb || empty
      fn(data.value)
    }
  }

  onSearch(cb) {
    this.search = async (data) => {
      const fn = cb || empty
      const result = await fn(data)
      this.result(result)
    }
  }

  onCloseTab(cb) {
    this.closeTab = (data) => {
      const fn = cb || empty
      fn(data.value)
    }
  }

  onHighlight(cb) {
    this.highlightTab = (data) => {
      const fn = cb || empty
      fn(data.value)
    }
  }

  onNewTab(cb) {
    this.newTab = (data) => {
      const fn = cb || empty
      fn(data.value)
    }
  }

  ping() {
    console.log('ping')
    this._postMessage(EventType.pong)
  }

  listen() {
    this.port.onMessage.addListener((msg, port) => {
      this.port = port
      const fnName = msg.type
      this[fnName](msg, port)
    })
  }
}




export class pageEvent {
  constructor(name) {
    this.name = name
    this.connect()
  }

  _postMessage(message) {
    if(typeof message === 'string') {
      this.port.postMessage({
        type: message,
        value: message
      })
    } else {
      this.port.postMessage(message)
    }
  }

  connect() {
    chrome.runtime.onConnect.addListener(port => {
      if(this.name !== port.name) return
      this.port = port
      port.onMessage.addListener((msg, port) => {
        if(msg.type === EventType.pong) {
          this.pong(msg, port)
        }
        this.listen(port)
      })
    })
  }

  disconnect() {
    this.port.disconnect()
  }

  listen(port) {
    port.onMessage.addListener((msg) => {
      switch (msg.type) {
        case EventType.visible:
          this.visible()
          break
        case EventType.result:
          this.result(msg.value)
          break
      }
    })
  }

  pong(msg, port) {
    this.port = port
    console.log('connect success')
    this.register()
  }

  register() {
    this._postMessage(EventType.register)
  }

  // 发送
  search(searchInfo) {
    this._postMessage({
      ...searchInfo,
      type: EventType.search,
      value: searchInfo.value
    })
  }

  closeTab(tab) {
    this._postMessage({
      type: EventType.closeTab,
      value: tab
    })
  }

  highlightTab(tab) {
    this._postMessage({
      type: EventType.highlightTab,
      value: tab
    })
  }

  newTab(info) {
    this._postMessage({
      type: EventType.newTab,
      value: info
    })
  }

  // 监听
  _listen() {
    this.visible = empty
    this.result = empty
  }
  onVisible(cb) {
    this.visible = cb || empty
  }

  onResult(cb) {
    this.result = cb || empty
  }
}

export default {}
