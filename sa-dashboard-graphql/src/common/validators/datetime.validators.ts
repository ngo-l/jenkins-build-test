import { isValid, parse} from 'date-fns'
import { ValidationError } from '../errors/validationError'

export const isISODateTime = (datetimeString: Date): Boolean => {
    const datetime = parse(String(datetimeString), "yyyy-MM-dd'T'HH:mm:ss'Z'", new Date())
    return isValid(datetime)
}

export const checkIfStartEndDateTimeValid = (startDateTime: Date, endDateTime: Date): void => {
    if (!isISODateTime(startDateTime) || !isISODateTime(endDateTime)) {
        throw new ValidationError('Invalid Datetime Format')
    }
}
