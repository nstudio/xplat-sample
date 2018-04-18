import { Environment, LogLevel } from './constants';

export interface Config {
  apiBaseUrl: string;
  apiUrl: string;
  environment: Environment;
  logLevel: LogLevel;
  firebaseKey: string;
}

export const config: Partial<Config> = {};

export function initConfig(environment: string = Environment.LOCALDEV, vars: any): Partial<Config> {
  Object.assign(config, vars[environment], {
    environment: environment
  });

  return config;
}
