import MockServer from 'mock-http-server'
import Request from '../src'

describe('Request', () => {
  const server = new MockServer(
    {
      host: 'localhost',
      port: 9000,
    },
    null
  )
  beforeEach((done) => {
    server.start(done)
  })
  afterEach((done) => {
    server.stop(done)
  })

  test('create request instance with no options', () => {
    const request = new Request()

    expect(request).toBeInstanceOf(Request)
    expect(request.baseURL).toBe('')
    expect(request.defaultHeaders).toEqual({})
  })
  test('create request instance with options', () => {
    const request = new Request({
      baseURL: 'http://a.b',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    expect(request).toBeInstanceOf(Request)
    expect(request.baseURL).toBe('http://a.b')
    expect(request.defaultHeaders).toEqual({
      'Content-Type': 'application/json',
    })
  })
  test('basic request use GET', async () => {
    const testData = {
      hello: 'world',
    }
    server.on({
      method: 'GET',
      path: '/test',
      reply: {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(testData),
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await request.get('/test')
    expect(data).toEqual(testData)
  })
  test('basic request use GET with custom host', async () => {
    const testData = {
      hello: 'world',
    }
    server.on({
      method: 'GET',
      path: '/test',
      reply: {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(testData),
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9001',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await request.get('http://localhost:9000/test')
    expect(data).toEqual(testData)
  })

  test('basic request use GET with query', async () => {
    const testData = {
      hello: 'world',
    }
    server.on({
      method: 'GET',
      path: '/test',
      reply: {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: (req, reply) => {
          expect(req.query).toEqual({
            test: 'test',
          })
          reply(JSON.stringify(testData))
        },
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await request.get('/test', {
      query: {
        test: 'test',
      },
    })
    expect(data).toEqual(testData)
  })

  test('basic request use GET with empty query', async () => {
    const testData = {
      hello: 'world',
    }
    server.on({
      method: 'GET',
      path: '/test',
      reply: {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: (req, reply) => {
          expect(req.query).toEqual({
            a: 'b',
          })
          reply(JSON.stringify(testData))
        },
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await request.get('/test?a=b', {
      query: {},
    })
    expect(data).toEqual(testData)
  })

  test('basic request use GET with invalid query', async () => {
    const testData = {
      hello: 'world',
    }
    server.on({
      method: 'GET',
      path: '/test',
      reply: {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: (req, reply) => {
          expect(req.query).toEqual({
            a: 'b',
            xxx: '',
          })
          reply(JSON.stringify(testData))
        },
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await request.get('/test?a=b', {
      query: 'xxx',
    })
    expect(data).toEqual(testData)
  })

  test('basic request use GET with empty query value', async () => {
    const testData = {
      hello: 'world',
    }
    server.on({
      method: 'GET',
      path: '/test',
      reply: {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: (req, reply) => {
          expect(req.query).toEqual({
            a: 'b',
          })
          reply(JSON.stringify(testData))
        },
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await request.get('/test?a=b', {
      query: {
        b: '',
      },
    })
    expect(data).toEqual(testData)
  })

  test('basic request use GET with query with exist search', async () => {
    const testData = {
      hello: 'world',
    }
    server.on({
      method: 'GET',
      path: '/test',
      reply: {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: (req, reply) => {
          expect(req.query).toEqual({
            test: 'test',
            a: 'b',
          })
          reply(JSON.stringify(testData))
        },
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await request.get('/test?a=b', {
      query: {
        test: 'test',
      },
    })
    expect(data).toEqual(testData)
  })

  test('basic request use GET with params', async () => {
    const testData = {
      hello: 'world',
    }
    server.on({
      method: 'GET',
      path: '/test/test',
      reply: {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: (req, reply) => {
          reply(JSON.stringify(testData))
        },
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await request.get('/test/{id}', {
      params: {
        id: 'test',
      },
    })
    expect(data).toEqual(testData)
  })

  test('basic request use GET with custom headers', async () => {
    const testData = {
      hello: 'world',
    }
    server.on({
      method: 'GET',
      path: '/test',
      reply: {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: (req, reply) => {
          expect(req.headers.test).toBe('test')
          reply(JSON.stringify(testData))
        },
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await request.get('/test', {
      headers: {
        test: 'test',
      },
    })
    expect(data).toEqual(testData)
  })

  test('basic request use POST', async () => {
    const testData = {
      hello: 'world',
    }
    server.on({
      method: 'POST',
      path: '/test',
      reply: {
        status: 201,
        headers: {
          'content-type': 'application/json',
        },
        body: (req, reply) => {
          expect(req.body).toEqual(testData)
          reply(
            JSON.stringify({
              ...testData,
              id: 1,
            })
          )
        },
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await request.post('/test', {
      body: testData,
    })

    expect(data).toEqual({
      ...testData,
      id: 1,
    })
  })

  test('basic request use POST with no requestOption', async () => {
    const testData = {
      hello: 'world',
    }
    server.on({
      method: 'POST',
      path: '/test',
      reply: {
        status: 201,
        headers: {
          'content-type': 'application/json',
        },
        body: (req, reply) => {
          expect(req.body).toEqual({})
          reply(
            JSON.stringify({
              ...testData,
              id: 1,
            })
          )
        },
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await request.post('/test')

    expect(data).toEqual({
      ...testData,
      id: 1,
    })
  })

  test('basic request use POST with custom body', async () => {
    const testData = {
      hello: 'world',
    }
    server.on({
      method: 'POST',
      path: '/test',
      reply: {
        status: 201,
        headers: {
          'content-type': 'application/json',
        },
        body: (req, reply) => {
          expect(req.body).toEqual('test')
          reply(
            JSON.stringify({
              ...testData,
              id: 1,
            })
          )
        },
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: {
        'Content-Type': 'text/plain',
      },
    })
    const data = await request.post('/test', {
      body: 'test',
    })

    expect(data).toEqual({
      ...testData,
      id: 1,
    })
  })

  test('basic request use PUT', async () => {
    const testData = {
      hello: 'world',
    }
    server.on({
      method: 'PUT',
      path: '/test',
      reply: {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: (req, reply) => {
          expect(req.body).toEqual(testData)
          reply(
            JSON.stringify({
              ...testData,
              id: 1,
            })
          )
        },
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await request.put('/test', {
      body: testData,
    })

    expect(data).toEqual({
      ...testData,
      id: 1,
    })
  })

  test('basic request use PUT with no requestOption', async () => {
    const testData = {
      hello: 'world',
    }
    server.on({
      method: 'PUT',
      path: '/test',
      reply: {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: (req, reply) => {
          expect(req.body).toEqual({})
          reply(
            JSON.stringify({
              ...testData,
              id: 1,
            })
          )
        },
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await request.put('/test')

    expect(data).toEqual({
      ...testData,
      id: 1,
    })
  })

  test('basic request use PATCH', async () => {
    const testData = {
      hello: 'world',
    }
    server.on({
      method: 'PATCH',
      path: '/test',
      reply: {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: (req, reply) => {
          expect(req.body).toEqual(testData)
          reply(
            JSON.stringify({
              ...testData,
              id: 1,
            })
          )
        },
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await request.patch('/test', {
      body: testData,
    })

    expect(data).toEqual({
      ...testData,
      id: 1,
    })
  })

  test('basic request use PATCH with no requestOption', async () => {
    const testData = {
      hello: 'world',
    }
    server.on({
      method: 'PATCH',
      path: '/test',
      reply: {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: (req, reply) => {
          expect(req.body).toEqual({})
          reply(
            JSON.stringify({
              ...testData,
              id: 1,
            })
          )
        },
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await request.patch('/test')

    expect(data).toEqual({
      ...testData,
      id: 1,
    })
  })

  test('basic request use DELETE', async () => {
    const testData = {
      hello: 'world',
    }
    server.on({
      method: 'DELETE',
      path: '/test',
      reply: {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: (req, reply) => {
          expect(req.query).toEqual(testData)
          reply(
            JSON.stringify({
              ...testData,
              id: 1,
            })
          )
        },
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await request.del('/test', {
      query: testData,
    })

    expect(data).toEqual({
      ...testData,
      id: 1,
    })
  })

  test('basic request use DELETE with no requestOption', async () => {
    const testData = {
      hello: 'world',
    }
    server.on({
      method: 'DELETE',
      path: '/test',
      reply: {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: (req, reply) => {
          reply(
            JSON.stringify({
              ...testData,
              id: 1,
            })
          )
        },
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await request.del('/test')

    expect(data).toEqual({
      ...testData,
      id: 1,
    })
  })

  test('basic request with response content type is text', async () => {
    server.on({
      method: 'GET',
      path: '/test',
      reply: {
        status: 200,
        headers: {
          'content-type': 'text/plain',
        },
        body: 'test',
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await request.request('/test', {})

    expect(data).toEqual('test')
  })

  test('basic request with bad response', async () => {
    const error = {
      code: 'NOT_FOUND',
      message: 'not found',
    }
    server.on({
      method: 'GET',
      path: '/test',
      reply: {
        status: 404,
        headers: {
          'content-type': 'text/plain',
        },
        body: JSON.stringify(error),
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    try {
      await request.get('/test')
    } catch (error) {
      expect(error).toEqual(error)
    }
  })

  test('basic request with beforeRequest and afterRequest hook', async () => {
    const testData = {
      hello: 'world',
    }
    server.on({
      method: 'GET',
      path: '/test',
      reply: {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: (req, reply) => {
          expect(req.headers.test).toBe('test')
          reply(JSON.stringify(testData))
        },
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: {
        'Content-Type': 'application/json',
      },
      beforeRequest: async (req) => {
        req.headers.test = 'test'
        return req
      },
      afterRequest: async (res) => {
        expect(res.status).toBe(200)
        expect(res.data).toEqual(testData)
        throw res
      },
    })
    try {
      await request.get('/test')
    } catch (error) {
      expect(error).toEqual(testData)
    }
  })

  test('basic request with invalid beforeRequest and afterRequest hook', async () => {
    const testData = {
      hello: 'world',
    }
    server.on({
      method: 'GET',
      path: '/test',
      reply: {
        status: 200,
        headers: {
          'content-type': 'text/plain',
        },
        body: (req, reply) => {
          expect(req.headers.test).toBeUndefined()
          reply(JSON.stringify(testData))
        },
      },
    })

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: {
        'Content-Type': 'application/json',
      },
      // eslint-disable-next-line
      // @ts-expect-error
      beforeRequest: [],
      // eslint-disable-next-line
      // @ts-expect-error
      afterRequest: [],
    })
    const data = await request.get('/test')
    expect(data).toEqual(testData)
  })

  test('basic request with invalid url', async () => {
    const request = new Request({
      headers: {
        'Content-Type': 'application/json',
      },
    })
    try {
      // eslint-disable-next-line
      // @ts-expect-error
      await request.get(1)
    } catch (error) {
      expect(error).toEqual(new TypeError('URL must be string'))
    }
  })

  test('basic request with invalid requestOption', async () => {
    const request = new Request()
    try {
      // eslint-disable-next-line
      // @ts-expect-error
      await request.request('', [])
    } catch (error) {
      expect(error).toEqual(new TypeError('Options must be an object!'))
    }
  })

  test('custom headers should not change default headers', async () => {
    const testData = {
      hello: 'world',
    }
    server.on({
      method: 'GET',
      path: '/test',
      reply: {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(testData),
      },
    })

    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: defaultHeaders,
    })
    const data = await request.get('/test', {
      headers: {
        test: '1111',
        'Content-Type': 'application/json',
      },
    })
    expect(data).toEqual(testData)
    expect(request.defaultHeaders).toEqual(defaultHeaders)
  })

  test('basic request with invalid body should throw REQUEST_ERROR', async () => {
    server.on({
      method: 'GET',
      path: '/test',
      reply: {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: '',
      },
    })
    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    const request = new Request({
      baseURL: 'http://localhost:9000',
      headers: defaultHeaders,
    })
    try {
      await request.get('/test')
    } catch (error) {
      expect(error).toEqual(new Error('REQUEST_ERROR'))
    }
  })
})
