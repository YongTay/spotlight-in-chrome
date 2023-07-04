
import { backgroundEvent } from './events/event.js'
import TabEvent from './events/tabEvent.js';

chrome.action.onClicked.addListener(() => {
  activeEvent()
})

function activeEvent() {
  const event = new TabEvent('spotlight')
  event.onRegister(() => {
    event.visible()
  })

  event.onSearch((_, data) => {
    search(data.value).then(res => {
      event.result(res)
    })
  })

  event.onCloseTab((tab) => {
    closeTab(tab)
  })

  event.onHighlight((tab) => {
    chrome.tabs.highlight({tabs: tab.index}).then(() => {})
  })

  event.onNewTab((tab) => {
    chrome.tabs.create({url: tab.url, active: true}).then(() => {})
  })
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.reload) {
    chrome.runtime.reload()
    sendResponse({finish: true})
  }
})

function search(data) {
  const engine = data.engine
  const value = data.value
  if (engine) {
    const url = engines[engine] || engines['bing']
    handleNewTab(url.replace('%s', value))
    return
  }
  return waitingList(value).then(res => {
    let result = []
    const tabs = res.tabs.filter(i => i.title.includes(value) || i.url.includes(value)).map(o => ({
      ...o,
      type: 'tab'
    }))
    const bookmarks = res.bookmarks.filter(i => i.title.includes(value) || i.url.includes(value)).map(o => ({
      ...o,
      type: 'bookmarks'
    }))
    const history = res.history.map(o => ({...o, type: 'history'}))
    result = [...tabs, ...bookmarks, ...history]
    return result
  })
}

function handleNewTab(url) {
  chrome.tabs.create({ url, active: true }).then(() => {})
}

function flatTree(tree) {
  const flatArray = []
  const flat = (data) => {
    if(Array.isArray(data)) {
      data.forEach(i => flat(i))
    } else if(Array.isArray(data.children)) {
      data.children.forEach(i => flat(i))
    } else {
      flatArray.push(data)
    }
  }
  flat(tree)
  return flatArray
}

async function waitingList(search) {
  const tabs = await chrome.tabs.query({})
  const tree = await chrome.bookmarks.getTree()
  const bookmarks = flatTree(tree)
  const history = await chrome.history.search({ text: search })
  return {
    tabs,
    bookmarks,
    history
  }
}

const engines = {
  bing: 'https://cn.bing.com/search?q=%s',
  baidu: 'https://www.baidu.com/s?ie=utf-8&tn=baidu&wd=%s',
  google: 'https://www.google.com/search?q=%s',
  github: 'https://github.com/search?q=%s&type=repositories',
  bbll: 'https://search.bilibili.com/all?keyword=%s'
}

function handleSearch(port, value, engine) {
  if(engine) {
    const url = engines[engine] || engines['bing']
    handleNewTab(url.replace('%s', value))
    return
  }
  waitingList(value).then(res => {
    let result = []
    const tabs = res.tabs.filter(i => i.title.includes(value) || i.url.includes(value)).map(o => ({...o, type: 'tab'}))
    const bookmarks = res.bookmarks.filter(i => i.title.includes(value) || i.url.includes(value)).map(o => ({...o, type: 'bookmarks'}))
    const history = res.history.map(o => ({...o, type: 'history'}))
    result = [...tabs, ...bookmarks, ...history]
    port.postMessage({
      type: 'result',
      value: result
    })
  })
}

function closeTab(tab) {
  chrome.tabs.remove(tab.id).then(() => {})
}
