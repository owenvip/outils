# Request

> http request for browser based on `window.fetch`

## Install

```bash
npm install @otools/request
```

## Usage

```js
import Request from "@otools/request";

const request = new Request({
  baseURL: "https://example.com",
});

request.get("/posts/{id}", {
  params: { id: 1 },
});
request.post("/posts", {
  body: { content: "content" },
});
request.put("/posts/{id}", {
  params: { id: 1 },
  body: { content: "content" },
});
request.patch("/posts/{id}", {
  params: { id: 1 },
  body: { content: "content" },
});
request.del("/posts/{id}", {
  params: { id: 1 },
});
```

## API

### Base API

- `new Request(options?)`

  - `options.baseURL`: optional, base url for each request
  - `options.headers`: optional,default headers
  - `options.beforeRequest`: optional,hook will be called before send request, see [below](#beforeRequest)
  - `options.afterRequest`: optional,hook will be called after receive response, see [below](#afterRequest)

- `request.get(url, Req)`: send http request use `GET`
- `request.post(url, Req)`: send http request use `POST`
- `request.put(url, Req)`: send http request use `PUT`
- `request.patch(url, Req)`: send http request use `PATCH`
- `request.del(url, Req)`: send http request use `DELETE`

### beforeRequest

- type: `(req: Req) => Promise<Req>`

### afterRequest

- type: `(res: Res) => Promise<Res>`

### Req

request config

- `body`: request body
- `headers`: request headers
- `query`: request query params
- `params`: request path params

### Res

original `fetch` response, but with `res.data`, which is serialized from `res.body` based on `Content-Type`
