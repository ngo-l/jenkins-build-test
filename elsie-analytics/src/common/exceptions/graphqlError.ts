export interface IGraphQLException {
  code?: string
  response?: string
  status?: number
  message?: string
  name?: string
  stacktrace?: readonly string[]
}
