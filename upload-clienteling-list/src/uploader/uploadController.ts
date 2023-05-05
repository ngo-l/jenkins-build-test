import { Context, HttpRequest } from '@azure/functions';
import { isXlsx, isFormData} from '../shared/utils'
import { getCSVFormFromFileWithBuffer, sendCsvFormDataToEliseServer } from './uploadService'
import *  as multipart from 'parse-multipart'
import { Response } from '../shared/utils'
import { Logger } from '../shared/logger'

export const uploadController = async (context: Context, req: HttpRequest): Promise<object> => {
    const logger = new Logger({ context, message: '' });
    const { body: body, headers: { "content-type": contentType } } = req  
    
    // check if the content type is undefined
    if (contentType === undefined){
        const msg = 'The contentType is undefined.'
        logger.log({ 'message': msg, 'level': 'ERROR'})
        return Response({ body: {'error': msg }, status: 400 })
    }
    
    // check if the content type is multipart form
    if (!isFormData(contentType)){
        const msg = `The content type must be multipart/form, but got ${contentType}`
        logger.log({ 'message': msg, 'level': 'ERROR'})
        return Response({ body: {'error': msg}, status: 400 })
    }

    const boundary = multipart.getBoundary(contentType)
    const files = multipart.Parse(Buffer.from(body), boundary)
    
    // check if the files contain less than 1 file
    if (files.length === 0){
        const msg = `No file found`
        logger.log({'message': msg, 'level': 'ERROR'})
        return Response({body: {'error': msg}, status: 400})
    }

    // check if the file extension is xlsx
    if (!isXlsx(files[0].filename)){
        const msg = `The file extension must be xlsx, but got the filename=${files[0].filename}`
        logger.log({'message': msg, 'level': 'ERROR'})
        return Response({body: {'error': msg}, status: 400})
    } 

    const file = Object(files[0])
    
    // transform the file with buffer in the format of form data
    const formData = await getCSVFormFromFileWithBuffer(file)

    // send the form data to the elise server
    const response = await sendCsvFormDataToEliseServer(formData)
    if (response.data.error) {
        logger.log({'message': response.data.error, 'level': 'ERROR'})
        return Response({ body: {'error': response.data.error}, status: 400 })
    }
    return Response({
        body: {
            'message': 'You have successully parsed the xlsx file, transformed it to csv and sent it to the Elsie server.',
        },
        status: 200
    })
}
