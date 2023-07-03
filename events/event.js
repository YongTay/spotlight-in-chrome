
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
export class Listener {
  constructor(name) {
    this.name = name
    chrome.runtime.onMessage.addListener((msg) => {
      if(msg.type === EventType.ping) {
        this.ping()
      }
    })
    this._listen()
  }

  _postMessage(message, port) {
    const curPort = port || this.port
    if(typeof message === 'string') {
      curPort.postMessage({
        type: message,
        value: message
      })
    } else {
      curPort.postMessage(message)
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
      this._postMessage(EventType.register)
      this.register = cb || empty
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
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tabPort = chrome.tabs.connect(tabs[0].id, { name: this.name })
      this.port = tabPort
      this._postMessage('pong', tabPort)
      this.listen()
    })
  }

  listen() {
    // this.port.onMessage.addListener((msg, port) => {
    //   this.port = port
    //   const fnName = msg.type
    //   this[fnName](msg, port)
    // })
  }
}




export class Connector {
  constructor(name) {
    this.name = name
    this.connect()
    this._listen()
  }

  _postMessage(message, port) {
    const curPort = port || this.port
    if(typeof message === 'string') {
      curPort.postMessage({
        type: message,
        value: message
      })
    } else {
      curPort.postMessage(message)
    }
  }

  connect() {
    chrome.runtime.onConnect.addListener(port => {
      if(this.name !== port.name) return
      this.port = port
      this._postMessage(EventType.ping, port)
      port.onMessage.addListener((msg, port) => {
        if(msg.type === EventType.pong) {
          this.pong(msg, port)
        }
        this.listen(port)
      })
    })
    chrome.runtime.sendMessage({
      type: EventType.ping,
      value: EventType.ping
    }).then(() => {})
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
  search(searchInfo, cb) {
    this._postMessage({
      ...searchInfo,
      type: EventType.search,
      value: searchInfo.value
    })
    this.onResult(cb)
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
