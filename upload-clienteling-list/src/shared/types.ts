import { LogMessageInterface } from '../shared/interfaces';

export type Logger = {
  log: (log: LogMessageInterface) => void;
};
