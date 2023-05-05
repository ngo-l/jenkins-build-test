import { Context, HttpRequest} from '@azure/functions'
import { HttpResponse } from '../shared/interfaces'
import { Response } from '../shared/utils'
import { Logger } from '../shared/logger'

import *  as multipart from 'parse-multipart'
import *  as fs from 'fs'

export const receiveCSVController = async (context: Context, req: HttpRequest): Promise<HttpResponse> => {
    const logger = new Logger({ context, message: '' });
    const {rawBody: rawBody, headers: { "content-type": contentType } } = req

    if (!contentType){
        return Response({body: {'error': 'The contentType is undefined.'}})
    }
    
    const boundary = multipart.getBoundary(contentType) 
    const files = multipart.Parse(Buffer.from(rawBody), boundary)
    
    if (files.length === 0 && boundary){
        logger.log({
            'message': 'Corrupted Request Body.',
            'level': 'ERROR'
        })
        return Response({body: {'error': 'Corrupted Request Body.'}})
    
    } else if (files.length === 0 && !boundary){
        logger.log({
            'message': 'No boundary found in the content type.',
            'level': 'ERROR' 
        })
        return Response({
            body: {'error': 'No boundary found in the content type.'}
        })
    
    } else {
        const fileName = `clienteling_data_${Date.now()}.csv`
        fs.writeFile(fileName, files[0].data.toString(), 'utf-8', () => {})
        return Response({
            body: {
                'message': 'The CSV file has arrived the Elsie Server.',
            },
            status: 201
        })
    }
}
