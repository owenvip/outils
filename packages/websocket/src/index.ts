/*
 * @Descripttion:
 * @Author: OwenWong
 * @Email: owen.cq.cn@gmail.com
 * @Date: 2021-07-28 11:36:22
 */
export interface Res extends Response {
  [x: string]: any
}

export interface HeartCheck {
  heartBeatMsg: string
  heartBeatInterval: number
  reconnectTimeout: number
  reconnectCount: number
}

interface State {
  count: number
  pingTimer?: ReturnType<typeof setInterval>
  pongTimer?: ReturnType<typeof setTimeout>
  pongRes?: Res
}

type CallBack<T> = (ev: T) => void

function getDefaultHeartCheck(): HeartCheck {
  return {
    heartBeatMsg: 'ping',
    heartBeatInterval: 60 * 1000,
    reconnectCount: 3,
    reconnectTimeout: 5 * 1000,
  }
}

export default class Websocket {
  private state: State
  private instance: WebSocket | null
  protected url: string
  protected heartCheck: HeartCheck

  constructor(url: string, heartCheck?: HeartCheck) {
    this.instance = null
    this.state = {
      count: 0,
    }
    this.url = url
    this.heartCheck = this.getHeartCheck(heartCheck)
  }

  private getHeartCheck = (options = {}): HeartCheck => ({
    ...getDefaultHeartCheck(),
    ...options,
  })

  public connect = (handleConnect?: WebSocket['onopen']) => {
    try {
      this.instance = new WebSocket(this.url)
      this.startHeartBeat()
      if (typeof handleConnect === 'function') {
        this.instance.onopen = handleConnect
      }
    } catch (err) {
      throw err
    }
  }

  public send = (msg: string) => {
    this.instance?.send(msg)
  }

  public close = (handleClose?: WebSocket['onclose']) => {
    if (this.instance) {
      if (typeof handleClose === 'function') {
        this.instance.onclose = handleClose
      }
      this.instance.close()
    }
  }

  public onMessage = (handleMessage: CallBack<Res>) => {
    if (this.instance) {
      this.instance.onmessage = (e) => {
        this.state.pongRes = e.data
        this.state.count = 0
        handleMessage(e.data)
      }
    }
  }

  public onError = (handleError: CallBack<Event>) => {
    if (this.instance) {
      this.instance.onerror = (e) => {
        handleError(e)
      }
    }
  }

  private onClose = () => {
    if (this.state.count < this.heartCheck.reconnectCount) {
      this.check()
      this.state.count++
    } else {
      clearInterval(this.state.pingTimer)
      clearTimeout(this.state.pongTimer)
      console.error(
        'WebSocket encountered an error, reconnection failed, the connection has been closed.'
      )
      this.close()
    }
  }

  private startHeartBeat = () => {
    this.state.pingTimer = setInterval(() => {
      this.state.pongRes = undefined
      this.check()
    }, this.heartCheck.heartBeatInterval)
  }

  private check = () => {
    const { heartBeatMsg, reconnectTimeout } = this.heartCheck
    this.instance?.send(heartBeatMsg)
    if (this.state.pongRes) return
    this.state.pongTimer = setTimeout(() => {
      if (this.state.pongRes) return
      // auto-reconnect will be trigger with ws.onclose()
      this.onClose()
    }, reconnectTimeout)
  }
}
