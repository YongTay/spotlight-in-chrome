
import EventType from './eventType.js';

class RuntimeEvent {
  constructor(name) {
    this.name = name
    this.port = null
    this.onConnect()
    this.callbackMap = {}
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

  onConnect() {
    chrome.runtime.onConnect.addListener(port => {
      if (port.name !== this.name) return
      this.port = port
      this.listen()
    })
  }

  disconnect() {
    this.port.disconnect()
  }

  addCallback(type, cb) {
    this.callbackMap[type] = cb
  }

  invoke(type, msg) {
    const fn = this.callbackMap[type] || (() => {})
    fn(msg.value, msg)
  }

  register() {
    this.postMessage(EventType.register)
  }
  search(data) {
    this.postMessage({
      type: EventType.search,
      value: data.value
    })
  }
  closeTab(data) {
    this.postMessage({
      type: EventType.closeTab,
      value: data
    })
  }

  newTab(data) {
    this.postMessage({
      type: EventType.newTab,
      value: data
    })
  }

  highlightTab(data) {
    this.postMessage({
      type: EventType.highlightTab,
      value: data
    })
  }

  onVisible(cb) {
    this.addCallback(EventType.visible, cb)
  }
  onResult(cb) {
    this.addCallback(EventType.result, cb)
  }

  listen() {
    this.port.onMessage.addListener((msg) => {
      if(msg.type === EventType.ping) {
        console.log('连接成功')
        this.postMessage(EventType.pong)
        this.register()
      } else {
        this.invoke(msg.type, msg)
      }
    })
  }
}

export default RuntimeEvent
