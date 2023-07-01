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
  console.log('register')
  chrome.action.onClicked.addListener(() => {
    console.log('click...')
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


async function waitingList() {
  const tabs = await chrome.tabs.query({})

  // const tree = await chrome.bookmarks.getTree()
  // const bookmarks = flatTree(tree)
  // const history = await chrome.history.search({ text: 'a' })
  return [...tabs]
}

waitingList()


