import 'isomorphic-fetch';
import { initConfig, Environment } from '../src/helpers';
import { initApiClient } from '../src/helpers';
import * as vars from '../env.json';

beforeAll(() => {
  const environment = process.env.ENVIRONMENT || Environment.LOCALDEV;
  const config = initConfig(environment, vars);
  initApiClient(config.apiUrl);
});
