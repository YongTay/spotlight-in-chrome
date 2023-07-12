
const sync = chrome.storage.sync
const local = chrome.storage.local

const KEY = 'spotlight'
export function setSync(data: Record<string, any>){
  return sync.set({[KEY]: data})
}

export function addOrUpdateItems(data: Record<string, any>) {
  getSync().then(res => {
    if (!res) {
      res = {}
    }
    for (const k in data) {
      res[k] = data[k]
    }
    setSync(res).then(() => {})
  })
}

export function removeItem(k: string) {
  return getSync().then(res => {
    if (res[k]) {
      const delData = res[k]
      res[k] = undefined
      setSync(res).then(() => {})
      return delData
    }
    return undefined
  })
}

export function getSync(keys?: string | string[]) {
  if(!keys) {
    return sync.get(KEY).then(res => res[KEY])
  }
  return sync.get(KEY).then(res => res[KEY]).then(res => {
    const ret: Record<string, any> = {}
    if(!Array.isArray(keys)) {
      ret[keys] = res[keys]
    } else {
      keys.forEach(k => ret[k] = res[k])
    }
    return ret
  })
}

export function setData(data: Record<string, any>) {
  return local.set({[KEY]: data})
}

export function getData(keys?: string | string[]) {
  if(!keys) {
    return local.get(KEY)
  }
  return local.get(KEY).then(res => {
    const ret: Record<string, any> = {}
    if(!Array.isArray(keys)) {
      ret[keys] = res[keys]
    } else {
      keys.forEach(k => ret[k] = res[k])
    }
    return ret
  })
}

export default {}
