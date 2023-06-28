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

