import { LogLevel } from './constants';

export interface Logger {
  error(message: string, ...vars: any[]): void;
  info(message: string, ...vars: any[]): void;
  debug(message: string, ...vars: any[]): void;
  log(level: LogLevel, message: string, ...vars: any[]): void;
}

/* tslint:disable:no-console */
export const logger: Logger = {
  error: (message: string, ...vars: any[]) => {
    console.error(message);
  },
  info: (message: string, ...vars: any[]) => {
    console.info(message);
  },
  debug: (message: string, ...vars: any[]) => {
    console.debug(message);
  },
  log: (level: LogLevel, message: string, ...vars: any[]) => {
    console.info(message);
  }
};
