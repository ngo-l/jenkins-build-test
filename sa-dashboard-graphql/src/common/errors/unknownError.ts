import { CustomError } from './CustomError'

export class UnknownError extends CustomError {
  statusCode: number = 404

  constructor(message: string) {
    super(message)
  }
  serializeErrors() {
    return [
      {
        message: this.message,
        statusCode: this.statusCode,
      },
    ]
  }
}
