export abstract class CustomError extends Error {
  abstract statusCode: number

  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, CustomError.prototype)
  }

  abstract serializeErrors(): {
    message: string
    statusCode: number
  }[]
}

export interface CustomGraphQLError {
  message: string
  extensions: {
    exception: CustomGraphQLException
  }
}

interface CustomGraphQLException {
  stacktrace: string[]
  statusCode: number
}
