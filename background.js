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
function handleClickRegister(port) {
  chrome.action.onClicked.addListener(() => {
    port.postMessage({
      type: 'visible',
      value: true
    })
  })
}

chrome.runtime.onConnect.addListener(port => {
  if(port.name !== 'spotlight') return
  port.onMessage.addListener(msg => {
    switch (msg.type) {
      case 'register':
        handleClickRegister(port, msg.value)
        break
      case 'search':
        handleSearch(port, msg.value)
        break
      case 'closeTab':
        closeTab(msg.value)
        break
    }
  })
})

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

function handleSearch(port, value) {
  console.log(value)
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