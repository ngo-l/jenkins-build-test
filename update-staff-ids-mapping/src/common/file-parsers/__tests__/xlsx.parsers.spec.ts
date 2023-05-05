import * as xlsxParsers from '../xlsx.parsers'

describe('requestBodyToBuffer', () => {
  it('should throw an error if the contentType is not multipart/form-data with boundary', () => {
    const body = {}
    const contentType = 'multipart/form-data'
    const mockResult = new Error(
      'the contentType should be multipart/form-data with boundary.'
    )
    expect(() => xlsxParsers.requestBodyToBuffer(body, contentType)).toThrow(
      mockResult
    )
  })

  it('should throw an error if there no file found in the body', () => {
    const body = Buffer.alloc(1024)
    const contentType =
      'multipart/form-data; boundary=---------------------------9051914041544843365972754266'
    const mockResult = new Error('You must have exactly one file')
    expect(() => xlsxParsers.requestBodyToBuffer(body, contentType)).toThrow(
      mockResult
    )
  })

  it('should throw an error if there no file found in the body', () => {
    const body = Buffer.alloc(1024)
    const contentType =
      'multipart/form-data; boundary=---------------------------9051914041544843365972754266'
    const mockValue = []
    const mockResult = new Error('You must have exactly one file')
    jest
      .spyOn(xlsxParsers, 'parseBufferWithBoundary')
      .mockReturnValueOnce(mockValue)
    expect(() => xlsxParsers.requestBodyToBuffer(body, contentType)).toThrow(
      mockResult
    )
  })

  it('should return a buffer', () => {
    const body = Buffer.alloc(1024)
    const contentType =
      'multipart/form-data; boundary=---------------------------9051914041544843365972754266'
    const mockValue = [
      {
        filename: 'test.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        data: { buffer: Buffer.alloc(1024) },
      },
    ]
    jest
      .spyOn(xlsxParsers, 'parseBufferWithBoundary')
      .mockReturnValueOnce(mockValue)
    const result = xlsxParsers.requestBodyToBuffer(body, contentType)
    expect(result).toBeInstanceOf(Buffer)
  })
})
