export interface HttpResponse {
  headers: HttpResponseHeader
  status: number
  body: object | string
  isRaw: boolean
}

export interface HttpResponseInput {
  headers?: HttpResponseHeader
  status?: number
  body: object | string
  isRaw?: boolean
}

export interface HttpResponseHeader {
  [name: string]: string | undefined
}
