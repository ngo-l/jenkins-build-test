export const contentTypeValidator = (contentType: string, targetContentType: string): Boolean => {
    if (contentType === null || contentType === undefined) {
        return false
    }
    return contentType.split(';')[0] === targetContentType
}
