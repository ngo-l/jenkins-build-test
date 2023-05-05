import { HttpException } from '@nestjs/common'

export class InternalServiceError extends HttpException {
  constructor(message: string, statusCode = 500) {
    super(message, statusCode)
  }
}

export class UnknownError extends HttpException {
  constructor(message: string, statusCode = 404) {
    super(message, statusCode)
  }
}

export class ValidationError extends HttpException {
  constructor(message: string, statusCode = 400) {
    super(message, statusCode)
  }
}
