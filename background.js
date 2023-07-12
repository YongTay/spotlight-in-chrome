
import TabEvent from './events/tabEvent.js';

chrome.action.onClicked.addListener(() => {
  activeEvent()
})

function activeEvent() {
  const event = new TabEvent('spotlight')
  event.onRegister(() => {
    event.visible()
    createEnginesData().then(engines => {
      event.sendEngines(engines)
    })
  })

  event.onSearch((_, data) => {
    search(data.value).then(res => {
      res && event.result(res)
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

async function search(data) {
  const engine = data.engine
  const value = data.value
  if (engine) {
    const engines = await createEnginesData()
    const url = engines[engine] || engines.default
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

const KEY = 'spotlight'

const defaultEngines = {
  bing: 'https://cn.bing.com/search?q=%s',
  baidu: 'https://www.baidu.com/s?ie=utf-8&tn=baidu&wd=%s',
  google: 'https://www.google.com/search?q=%s',
  default: 'bing'
}

function createEnginesData() {
  return chrome.storage.sync.get(KEY)
    .then(res => res[KEY])
    .then(res => res && res['engines'])
    .then(res => {
      const ret = {
        default: 'bing'
      }
      if(!res) return defaultEngines
      for(const k in res) {
        const val = res[k]
        if(val.default) {
          ret.default = val.keyword
        }
        ret[val.keyword] = val.url
      }
      return ret
    })
}

function closeTab(tab) {
  chrome.tabs.remove(tab.id).then(() => {})
}
