import { CustomError } from './CustomError'

export class InternalServiceError extends CustomError {
  statusCode: number = 500

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
