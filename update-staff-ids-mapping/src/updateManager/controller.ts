import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { Response } from '../common/utils/azure.http.response'
import { HttpResponse } from '../common/interfaces/azure.http.interfaces'
import { managerRepository } from './manager.repository'
import { bufferToJSONArray, requestBodyToBuffer } from '../common/file-parsers/xlsx.parsers'
import { contentTypeValidator } from '../common/validators/requests.validators'
import { managerService } from './manager.service'

export const updateManagerController: AzureFunction = async function (context: Context, req: HttpRequest): Promise<HttpResponse> {
    const { body, headers: { 'content-type': contentType } } = req
    if (!contentTypeValidator(contentType.split(';')[0], 'multipart/form-data')){
        return Response({ body: { 'error': 'content-type must be multipart/form-data with boundary' }, status: 400 })
    }
    try {
        const buffer = requestBodyToBuffer(body, contentType)
        const jsonArray = bufferToJSONArray(buffer)

        const managerData = await managerService.assignManagerData(jsonArray)
        await managerRepository.truncate("MANAGERS")

        await managerRepository.replaceInto("MANAGERS", managerData.filter(Boolean), ['STAFF_ID', 'NAME'])


        const supervisorManagerData = await managerService.assignSupervisorManagerData(jsonArray)
        
        await managerRepository.truncate('MANAGER_SUPERVISOR_MAPPING')

        await managerRepository.replaceInto(
            'MANAGER_SUPERVISOR_MAPPING', 
            supervisorManagerData.filter(Boolean), ['MANAGER_STAFF_ID', 'SUPERVISOR_STAFF_ID']
        )
        return Response({ body: { 'message': 'success' }, status: 200 })
    } catch(err) {
        return Response({ body: { 'error': err.message }, status: 400 })
    }
}
