import { Context } from '@azure/functions';
import { LoggerInterface } from './interfaces';
import { LogMessageInterface } from './interfaces';

export class Logger implements LoggerInterface {
  readonly context: Context;
  message: string;

  constructor(logger: LoggerInterface) {
    this.context = logger.context;
    this.message = logger.message;
  }

  log(log: LogMessageInterface) {
    this.context.log({
      message: log.message,
      level: log.level,
      timestamp: `${Date.now()}`,
    });
  }
}
