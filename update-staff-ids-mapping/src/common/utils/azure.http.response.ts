import { HttpResponseInput, HttpResponse } from '../interfaces/azure.http.interfaces'

export const Response = (responseObj: HttpResponseInput): HttpResponse => {
    const { headers, status, body, isRaw } = responseObj
    return {
        headers: headers || { 'Content-Type': 'application/json' },
        status: status || 200,
        body: body,
        isRaw: isRaw || true
    }
}
