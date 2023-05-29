import {
  Req,
  Post,
  HttpCode,
  Controller,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { renameXlsxColumnName } from '../common/utils/wrangler'
import { bufferToJSONArray } from '../common/file-parsers/csv.parsers'
import { StaffService } from './staff.service'

@Controller('staff')
export class StaffController {
  constructor(private staffService: StaffService) {}

  @Post('update')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async updateStaffCustomer(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'text/csv' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    // get file buffer object
    const { buffer } = file
    // parse buffer to json array
    const jsonArray = bufferToJSONArray(buffer)
    const wrangledData = renameXlsxColumnName(jsonArray)
    const staffData = await this.staffService.assignStaffData(wrangledData)
    this.staffService.truncateReplaceIntoStaffTable(staffData)
    // Return success response
    return { message: 'success' }
  }
}
