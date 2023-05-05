import { CustomError } from './CustomError'

export class ValidationError extends CustomError {
  statusCode: number = 400

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
