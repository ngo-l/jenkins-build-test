import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { Response } from '../common/utils/azure.http.response'
import { HttpResponse } from '../common/interfaces/azure.http.interfaces'
import { databaseConnection } from '../common/database/mysql.connector'

export const healthcheckController: AzureFunction = async function (context: Context, req: HttpRequest): Promise<HttpResponse> {
    const conn = await databaseConnection.getConnection()
    const results = await conn.raw('SELECT VERSION();')
    return Response({ body: { 'message': results[0] }, status: 200 })   
}
