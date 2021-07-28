/*
 * @Descripttion:
 * @Author: OwenWong
 * @Email: owen.cq.cn@gmail.com
 * @Date: 2021-07-28 11:36:22
 */
export interface Res extends Response {
  [x: string]: any
}

export default class Websocket {
  public instance: WebSocket | null
  public url: string

  constructor(url: string) {
    this.instance = null
    this.url = url.startsWith('ws://') ? url : `ws://${url}`
  }

  public connect = (handleConnect?: () => void) => {
    try {
      this.instance = new WebSocket(this.url)
      if (typeof handleConnect === 'function') {
        if (this.instance) {
          this.instance.onopen = handleConnect
        }
      }
    } catch (err) {
      throw err
    }
  }

  public send = (msg: string) => {
    this.instance?.send(msg)
  }

  public close = (handleClose?: () => void) => {
    if (this.instance) {
      if (typeof handleClose === 'function') {
        this.instance.onclose = handleClose
      }
      this.instance.close()
    }
  }

  public onMessage = (handleMessage: (res: Res) => void) => {
    if (this.instance) {
      this.instance.onmessage = (e) => {
        handleMessage(e.data)
      }
    }
  }

  public onError = (handleError: (e: Event) => void) => {
    if (this.instance) {
      this.instance.onerror = (e) => {
        handleError(e)
      }
    }
  }
}
