
import { Listener } from './events/event.js'

const listener = new Listener('spotlight')
listener.onRegister(() => {
  chrome.action.onClicked.addListener(() => {
    listener.visible()
  })
})
listener.onSearch((data) => {
  const engine = data.engine
  const value = data.value
  if(engine) {
    const url = engines[engine] || engines['bing']
    handleNewTab(url.replace('%s', value))
    return
  }
  return waitingList(value).then(res => {
    let result = []
    const tabs = res.tabs.filter(i => i.title.includes(value) || i.url.includes(value)).map(o => ({...o, type: 'tab'}))
    const bookmarks = res.bookmarks.filter(i => i.title.includes(value) || i.url.includes(value)).map(o => ({...o, type: 'bookmarks'}))
    const history = res.history.map(o => ({...o, type: 'history'}))
    result = [...tabs, ...bookmarks, ...history]
    return result
  })
})

listener.onCloseTab((tab) => {
  closeTab(tab)
})

listener.onHighlight((tab) => {
  chrome.tabs.highlight({ tabs: tab.index }).then(() => {})
})

listener.onNewTab((tab) => {
  chrome.tabs.create({ url: tab.url, active: true }).then(() => {})
})

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.reload) {
    chrome.runtime.reload()
    sendResponse({finish: true})
  }
})

/**
 * 注册点击事件
 * @param port
 */
// function handleClickRegister(port) {
  // chrome.action.onClicked.addListener(() => {
  //   port.postMessage({
  //     type: 'visible',
  //     value: true
  //   })
  // })
// }

// chrome.runtime.onConnect.addListener(port => {
//   if(port.name !== 'spotlight') return
//   port.onMessage.addListener(msg => {
//     switch (msg.type) {
//       case 'register':
//         handleClickRegister(port, msg.value)
//         break
//       case 'search':
//         handleSearch(port, msg.value, msg.engine)
//         break
//       case 'closeTab':
//         closeTab(msg.value)
//         break
//       case 'existTab':
//         handleExistTab(msg.value)
//         break
//       case 'newTab':
//         handleNewTab(msg.value)
//     }
//   })
// })

function handleExistTab(index) {
  chrome.tabs.highlight({ tabs: index }).then(() => {})
  chrome.tabs.update({ active: true }).then(() => {})
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
