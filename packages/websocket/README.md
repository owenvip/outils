<!--
 * @Descripttion:
 * @Author: OwenWong
 * @Email: owen.cq.cn@gmail.com
 * @Date: 2021-07-28 11:25:14
-->

# Websocket

> websocket for browser

## Install

```bash
npm install @otools/websocket
```

## Usage

```js
import Websocket from '@otools/websocket'

const ws = new Websocket('ws://example.com')
ws.connect(() => {
  console.log('ws connected')
})
ws.send('msg')
ws.onMessage((res) => {
  console.log('receive message from service')
})
ws.onError((err) => {
  console.error('websocket occurred error')
})
ws.close(() => {
  console.log('ws closed')
})
```
