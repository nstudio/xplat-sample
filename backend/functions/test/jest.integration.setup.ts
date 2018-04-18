import { initConfig, connectToFirebase, Environment } from '../src/helpers';
import * as vars from '../env.json';

beforeAll(() => {
  const environment = process.env.ENVIRONMENT || Environment.LOCALDEV;
  const config = initConfig(environment, vars);
  connectToFirebase(config.firebaseKey);
});
