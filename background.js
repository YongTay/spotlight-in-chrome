
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if(msg.reload) {
    chrome.runtime.reload()
    sendResponse({finish: true})
    console.log('finish reload')
  }
})
