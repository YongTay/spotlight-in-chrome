
import EventType from './eventType.js';

class TabEvent {
  constructor(name) {
    this.name = name
    this.port = null
    this.tab = null
    this.connect()
    this.callbackMap = {}
  }

  connect() {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      this.tab = tabs[0]
      const tabPort = chrome.tabs.connect(tabs[0].id, {name: this.name})
      this.port = tabPort
      this.ping()
      this.listen()
    })
  }

  disconnect() {
    this.port.disconnect()
  }

  postMessage(message) {
    if (typeof message === 'string') {
      this.port.postMessage({
        type: message,
        value: message
      })
    } else {
      this.port.postMessage(message)
    }
  }


  ping() {
    console.log('ping...')
    this.postMessage(EventType.ping)
  }

  addCallback(type, cb) {
    this.callbackMap[type] = cb
  }

  invoke(type, msg) {
    const fn = this.callbackMap[type] || (() => {})
    fn(msg.value, msg)
  }

  visible() {
    this.postMessage(EventType.visible)
  }

  result(data) {
    this.postMessage({
      type: EventType.result,
      value: data
    })
  }

  sendEngines(data) {
    this.postMessage({
      type: EventType.engines,
      value: data
    })
  }

  onRegister(cb) {
    this.addCallback(EventType.register, cb)
  }

  onSearch(cb) {
    this.addCallback(EventType.search, cb)
  }

  onCloseTab(cb) {
    this.addCallback(EventType.closeTab, cb)
  }
  onHighlight(cb) {
    this.addCallback(EventType.highlightTab, cb)
  }
  onNewTab(cb) {
    this.addCallback(EventType.newTab, cb)
  }

  listen() {
    this.port.onMessage.addListener(msg => {
      if(msg.type === EventType.pong) {
        console.log('连接成功')
      } else {
        this.invoke(msg.type, msg)
      }
    })
  }
}


export default TabEvent
