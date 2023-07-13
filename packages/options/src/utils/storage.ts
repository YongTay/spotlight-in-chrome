
const DEV = import.meta.env.MODE === 'development'

class Storage {
  set(v: any) {
    return Promise.resolve(v)
  }
  get() {
    return Promise.resolve({})
  }
}

const sync =  DEV ? new Storage() : chrome.storage.sync
const local = DEV ? new Storage() : chrome.storage.local

const KEY = 'spotlight'
export function setSync(data: Record<string, any>){
  return sync.set({[KEY]: { engines: data }})
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

export function getSync(keys?: string | string[]) : Promise<{[k: string]: any}>{
  if(!keys) {
    return sync.get(KEY)
      .then(res => res[KEY])
      .then(res => res && res['engines'])
      .then(res => res ? res : ({}))
  }
  return sync.get(KEY).then(res => res[KEY])
    .then(res => res && res['engines']).then(res => {
      if(!res) return {}
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
