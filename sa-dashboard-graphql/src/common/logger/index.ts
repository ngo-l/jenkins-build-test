import { createLogger, transports, format } from 'winston'


const logger = createLogger({
    level: 'info',
    format: format.json(),
    transports: [
        new transports.Console()
    ]
})

export default logger
