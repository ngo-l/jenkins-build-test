import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { Response } from '../common/utils/azure.http.response'
import { HttpResponse } from '../common/interfaces/azure.http.interfaces'
import { storemanagerRepository } from './storemanager.repository'
import { bufferToJSONArray, requestBodyToBuffer } from '../common/file-parsers/xlsx.parsers'
import { contentTypeValidator } from '../common/validators/requests.validators'
import { storemanagerService } from './storemanager.service'

export const updateStoreManagerController: AzureFunction = async function (context: Context, req: HttpRequest): Promise<HttpResponse> {
    const { body, headers: { 'content-type': contentType } } = req
    if (!contentTypeValidator(contentType.split(';')[0], 'multipart/form-data')){
        return Response({ body: { 'error': 'content-type must be multipart/form-data with boundary' }, status: 400 })
    }
    try {
        const buffer = requestBodyToBuffer(body, contentType)
        const jsonArray = bufferToJSONArray(buffer)
  
        const storeManagerdata = await storemanagerService.assignStoreManagerdata(jsonArray)
        await storemanagerRepository.truncate('STOREMANAGERS')

        await storemanagerRepository.replaceInto('STOREMANAGERS', storeManagerdata.filter(Boolean), ['STAFF_ID', 'NAME'])

        const storeManagerManagerData = await storemanagerService.assignStoreManagerManagerData(jsonArray)
        await storemanagerRepository.truncate('STOREMANAGER_MANAGER_MAPPING')

        await storemanagerRepository.replaceInto('STOREMANAGER_MANAGER_MAPPING', storeManagerManagerData.filter(Boolean), ['STOREMANAGER_STAFF_ID', 'MANAGER_STAFF_ID'])
        
        return Response({ body: { 'message': 'success' }, status: 200 })

    } catch(err) {
        return Response({ body: { 'error': err.message }, status: 400 })
    }
   
}
