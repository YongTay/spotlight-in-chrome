
declare interface Message {
  type: string,
  value: any
}

declare class backgroundEvent {
}

declare class pageEvent {
}

type cbFn = (value: any, message: any) => void
declare class TabEvent {
  constructor(name: string)

  /**
   * 发起长连接
   */
  connect(): void

  /**
   * 断开连接
   */
  disconnect(): void

  /**
   * 消息发送
   * @param message
   */
  postMessage(message: string | Message | Record<string, any>): void

  /**
   * 连通性测试
   */
  ping(): void

  /**
   * 增加回调
   * @param type
   * @param cb
   */
  addCallback(type: string, cb: cbFn): void

  /**
   * 执行回调
   * @param type
   * @param message
   */
  invoke(type: string, message: string | Message | Record<string, any>): void

  /**
   * 发送显示事件
   */
  visible(): void

  /**
   * 发送结果
   * @param data
   */
  result(data: any): void

  /**
   * 监听注册事件
   * @param cb
   */
  onRegister(cb: cbFn): void

  /**
   * 监听搜索事件
   * @param cb
   */
  onSearch(cb: cbFn): void

  /**
   * 监听关闭tab事件
   * @param cb
   */
  onCloseTab(cb: cbFn): void

  /**
   * 监听高亮tab事件
   * @param cb
   */
  onHighlight(cb: cbFn): void

  /**
   * 监听新建tab事件
   * @param cb
   */
  onNewTab(cb: cbFn): void

  /**
   * 统一监听处理
   */
  listen(): void
}

declare class RuntimeEvent {
  constructor(name: string)

  /**
   * 监听当前tab的连接
   */
  onConnect(): void

  /**
   * 断开当前连接
   */
  disconnect(): void

  /**
   * 消息发送
   * @param message
   */
  postMessage(message: string | Record<string, any>): void

  /**
   * 增加监听回调
   * @param type
   * @param cb
   */
  addCallback(type: string, cb: cbFn): void

  /**
   * 回调执行
   * @param type
   * @param data
   */
  invoke(type: string, data: string | Record<string, any>): void

  /**
   * 注册事件
   */
  register(): void

  /**
   * 触发搜索事件
   * @param data
   */
  search(data: any): void

  /**
   * 触发关闭tab事件
   * @param data
   */
  closeTab(data: any): void

  /**
   * 触发新建tab
   * @param data
   */
  newTab(data: any): void

  /**
   * 高亮指定tab
   * @param data
   */
  highlightTab(data: any): void

  /**
   * 监听显示
   * @param cb
   */
  onVisible(cb: cbFn): void

  /**
   * 监听返回结果
   * @param cb
   */
  onResult(cb: cbFn): void

  /**
   * 统一监听处理
   */
  listen(): void
}
