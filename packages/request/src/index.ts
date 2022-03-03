import isEmpty from 'lodash/isEmpty'
import isPlainObject from 'lodash/isPlainObject'
import cloneDeep from 'lodash/cloneDeep'
import template from 'string-template'
import { stringify } from 'qs'

const noop = (arg: any) => arg

export enum Method {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS',
}

export interface ReqQuery {
  [x: string]: any
}

export interface ReqParams {
  [x: string]: any
}

export interface ReqBody {
  [x: string]: any
}

export interface ReqHeader {
  [x: string]: any
}

export interface Req {
  url?: string
  baseURL?: string
  query?: ReqQuery | string
  params?: ReqParams
  body?: ReqBody | string
  method?: Method | string
  headers?: ReqHeader
  mode?: string
}

export interface Res<T = any> extends Response {
  data?: T
}

export type BeforeRequestFunc = (req: Req) => Req | Promise<Req>
export type AfterRequestFunc = <T = any>(
  res: Res<T>
) => Res<T> | Promise<Res<T>>
export type ErrHandlerFunc = (err: Error) => void

export interface ReqOption {
  baseURL: string
  headers: ReqHeader
  beforeRequest: BeforeRequestFunc
  afterRequest: AfterRequestFunc
  timeout?: number
  errHandler?: ErrHandlerFunc
}

export default class Request {
  public baseURL: string
  public defaultHeaders: ReqHeader
  public beforeRequest: BeforeRequestFunc
  public afterRequest: AfterRequestFunc
  public errHandler: ErrHandlerFunc
  public timeout: number

  constructor(options: Partial<ReqOption> = {}) {
    const {
      baseURL = '',
      headers = {},
      beforeRequest = noop,
      afterRequest = noop,
      errHandler = noop,
      timeout = 0,
    } = options

    this.baseURL = baseURL
    this.defaultHeaders = headers
    this.beforeRequest = beforeRequest
    this.afterRequest = afterRequest
    this.errHandler = errHandler
    this.timeout = timeout
  }

  private getBody = async (res: Response) => {
    const type = res.headers.get('Content-Type')
    if (type && type.indexOf('json') !== -1) {
      try {
        const json = await res.json()
        return json
      } catch (error) {
        throw new Error('REQUEST_ERROR')
      }
    }

    const body = await res.text()

    try {
      return JSON.parse(body)
    } catch (error) {
      return body
    }
  }

  private parseReq = (req: Req): Req => {
    const { params, baseURL = this.baseURL, method = Method.GET } = req
    let { body, url = '', query } = req
    if (body) {
      if (isPlainObject(body) || Array.isArray(body)) {
        if (/^(POST|PUT|PATCH)$/i.test(method)) {
          body = JSON.stringify(body)
        }
      }
      req.body = body
    }

    if (query) {
      if (typeof query === 'object') {
        Object.keys(query).forEach((key) => {
          const value = (query as ReqQuery)[key]
          if (typeof value !== 'number' && isEmpty(value)) {
            delete (query as any)[key]
          }
        })
        query = stringify(query)
      }
      url += (url.indexOf('?') === -1 ? '?' : '&') + query
    }

    if (params) {
      url = template(url, params)
    }
    if (/^\/[^/]/.test(url) && baseURL) {
      url = baseURL + url
    }

    req.url = url
    req.method = method
    req.mode = 'cors'
    return req
  }

  public request = async <T = any>(
    url: string | Req,
    reqOptions: Req = { url: '' }
  ): Promise<T> => {
    let options = cloneDeep(reqOptions)
    if (typeof url === 'object') {
      options = { ...url }
    }

    if (!isPlainObject(options)) {
      throw new TypeError('Options must be an object!')
    }

    if (typeof url === 'string') {
      options.url = url
    }

    const { headers = {} } = options

    options.headers = Object.assign({}, this.defaultHeaders, headers)

    if (typeof options.url !== 'string') {
      throw new TypeError('URL must be string')
    }

    let req = this.parseReq(options)

    try {
      if (typeof this.beforeRequest === 'function') {
        req = await this.beforeRequest(req)
      }
      const fetchPromise = [fetch(req.url || '', req as RequestInit)]
      if (this.timeout) {
        fetchPromise.push(
          new Promise((_, reject) => {
            setTimeout(() => {
              reject('error, request timeout.')
            }, this.timeout)
          })
        )
      }
      let res: Res = await Promise.race(fetchPromise)
      const data = await this.getBody(res)
      res.data = data
      if (typeof this.afterRequest === 'function') {
        res = await this.afterRequest<T>(res)
      }
      if (res.ok) {
        return res.data
      } else {
        throw res.data
      }
    } catch (error) {
      // throw response directly in afterRequest
      if (error.data) {
        throw error.data
      }
      if (typeof this.errHandler === 'function') {
        this.errHandler(error)
      }
      throw error
    }
  }

  public get = <T = any>(url: string, options: Req = {}): Promise<T> => {
    return this.request<T>(url, {
      ...options,
      method: Method.GET,
    })
  }

  public post = <T = any>(url: string, options: Req = {}): Promise<T> => {
    return this.request<T>(url, {
      ...options,
      method: Method.POST,
    })
  }

  public put = <T = any>(url: string, options: Req = {}): Promise<T> => {
    return this.request<T>(url, {
      ...options,
      method: Method.PUT,
    })
  }

  public patch = <T = any>(url: string, options: Req = {}): Promise<T> => {
    return this.request<T>(url, {
      ...options,
      method: Method.PATCH,
    })
  }

  public del = <T = any>(url: string, options: Req = {}): Promise<T> => {
    return this.request<T>(url, {
      ...options,
      method: Method.DELETE,
    })
  }
}
