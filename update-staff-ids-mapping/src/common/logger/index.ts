import { createLogger, transports, format } from 'winston'

const { combine, errors, timestamp, prettyPrint } = format

const logger = createLogger({
    format: combine(
        errors({ stack: true }),
        timestamp(),
        prettyPrint()
      ),
    transports: [
        new transports.Console()
    ]
})

export default logger
