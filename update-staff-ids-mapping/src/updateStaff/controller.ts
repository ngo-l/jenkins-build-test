import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { Response } from '../common/utils/azure.http.response'
import { HttpResponse } from '../common/interfaces/azure.http.interfaces'
import { bufferToJSONArray, requestBodyToBuffer } from '../common/file-parsers/xlsx.parsers'
import { contentTypeValidator } from '../common/validators/requests.validators'
import { staffRepository } from './staff.repository'
import { staffService } from './staff.service'

export const updateStaffCustomerController: AzureFunction = async function (context: Context, req: HttpRequest): Promise<HttpResponse> {
    const { body, headers: { 'content-type': contentType } } = req
    if (!contentTypeValidator(contentType.split(';')[0], 'multipart/form-data')){
        return Response({ body: { 'error': 'content-type must be multipart/form-data with boundary' }, status: 400 })
    }
    try {
        const buffer = requestBodyToBuffer(body, contentType)
        const jsonArray = bufferToJSONArray(buffer)

        const data = await staffService.assignStaffData(jsonArray)


        await staffRepository.truncate('STAFF_CUSTOMERS')

        await staffRepository.replaceInto('STAFF_CUSTOMERS', data.filter(Boolean), ['CUSTOMER_VIP_NO', 'STAFF_ID', 'STATUS', 'CUSTOMER_TYPE'])
        return Response({ body: { 'message': 'success' }, status: 200 })

    } catch(err) {
        return Response({ body: { 'error': err.message }, status: 400 })
    }
   
}
