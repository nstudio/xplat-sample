require('source-map-support').install();
import { logger } from './helpers';
import { startApi } from './middleware';
import { initBackend, PORT } from './backend.init';

(async function startApp() {
  initBackend(process.env.ENVIRONMENT);
  await startApi(PORT);
  logger.info(`Application Online, Port ${PORT}`);
})();
