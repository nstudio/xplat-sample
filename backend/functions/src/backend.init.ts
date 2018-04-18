import { initConfig, connectToFirebase, Environment } from './helpers';
import * as vars from '../env.json';

export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

export function initBackend(environment: string = Environment.LOCALDEV) {
  const config = initConfig(environment, vars);
  connectToFirebase(config.firebaseKey);
}
