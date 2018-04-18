require('source-map-support').install();
import * as functions from 'firebase-functions';
import { getExpressApp } from './middleware';
import { initBackend } from './backend.init';

initBackend(functions.config().sp.env);
const app = getExpressApp();
export const api = functions.https.onRequest(app);
