import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import axios from 'axios'
import { Response } from '../common/utils/azure.http.response'
import { HttpResponse } from '../common/interfaces/azure.http.interfaces'
import { contentTypeValidator } from '../common/validators/requests.validators'
import { userRepository } from './user.repository'
import { userService } from './user.service'
import { globalConfig } from '../common/config/config'

export const createUserController: AzureFunction = async function (context: Context, req: HttpRequest): Promise<HttpResponse> {
  const { body, headers: { 'content-type': contentType } } = req
  if (!contentTypeValidator(contentType.split(';')[0], 'application/json')) {
    return Response({ body: { 'error': 'content-type must be application/json' }, status: 400 })
  }
  try {
    const { data: jsonArray } = await axios.get('https://www.yammer.com/api/v1/users/by_email.json', {
      params: { email: body?.email },
      headers: {
        'Authorization': `Bearer ${globalConfig.yammerToken}`,
        'Content-Type': 'application/json'
      }
    })
    const data = await userService.assignUserProfilesData(jsonArray)
    if (data.length === 0) {
      return Response({ body: { 'error': `Users are already existed` }, status: 400 })
    }

    await userRepository.createOneUser(data.filter(Boolean))
    return Response({ body: { 'message': 'success' }, status: 200 })
  } catch (err) {
    return Response({ body: { 'error': err.message }, status: 400 })
  }
}
