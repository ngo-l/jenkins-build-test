import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { Response } from '../common/utils/azure.http.response'
import { HttpResponse } from '../common/interfaces/azure.http.interfaces'
import { supervisorRepository } from './supervisor.repository'
import { bufferToJSONArray, requestBodyToBuffer } from '../common/file-parsers/xlsx.parsers'
import { contentTypeValidator } from '../common/validators/requests.validators'
import { supervisorService } from './supervisor.service'

export const updateSupervisorController: AzureFunction = async function (context: Context, req: HttpRequest): Promise<HttpResponse> {
    const { body, headers: { 'content-type': contentType } } = req
    if (!contentTypeValidator(contentType.split(';')[0], 'multipart/form-data')){
        return Response({ body: { 'error': 'content-type must be multipart/form-data with boundary' }, status: 400 })
    }
    try {
        const buffer = requestBodyToBuffer(body, contentType)
        const jsonArray = bufferToJSONArray(buffer)
        
        const supervisorData = await supervisorService.assignSupervisorData(jsonArray)
        await supervisorRepository.truncate('SUPERVISORS')

        await supervisorRepository.replaceInto('SUPERVISORS', supervisorData.filter(Boolean), ['STAFF_ID', 'NAME'])

        const supervisorStaffData = await supervisorService.assignSupervisorStaffData(jsonArray)
        await supervisorRepository.truncate('SUPERVISOR_STAFF_MAPPING')

        await supervisorRepository.replaceInto('SUPERVISOR_STAFF_MAPPING', supervisorStaffData.filter(Boolean), ['SUPERVISOR_STAFF_ID', 'STAFF_ID'])
        
        return Response({ body: {'message': 'success'}, status: 200 })

    } catch(err) {
        return Response({ body: { 'error': err.message }, status: 400 })
    }
   
}
