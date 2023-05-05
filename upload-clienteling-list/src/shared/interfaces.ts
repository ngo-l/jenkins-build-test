import { Context } from '@azure/functions';


export interface HttpResponse {
    headers: HttpResponseHeader
    status: number
    body: object | string
    isRaw: boolean
}

export interface HttpResponseInput  {
    headers?: HttpResponseHeader
    status?: number
    body: object | string
    isRaw?: boolean
}

export interface HttpResponseHeader {
    [name: string]: string | undefined;
}

export interface LogMessageInterface {
    readonly message: string;
    readonly level: 'ERROR' | 'WARN' | 'INFO';
  }

export interface LoggerInterface {
  readonly context: Context;
  message: string;
}
