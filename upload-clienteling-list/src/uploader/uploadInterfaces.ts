
interface BufferObjInterface {
    [buffer: string] : Buffer
}

export interface FileObjectInterface {
    filename: string
    type: string
    data: BufferObjInterface
}
