import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import { graphql, graphqlInteractive } from './graphql.middleware';
import { getUserFromToken } from './auth.middleware';
import { config, Environment } from '../helpers';

let server: any;

export function getExpressApp() {
  const app = express();

  // Security
  app.use(helmet());
  app.use(
    cors({
      origin: [/localhost:.*/, /sketchpoints.io/],
      optionsSuccessStatus: 200,
      credentials: true
    })
  );

  app.use(bodyParser.json());

  // get the current user from jwt token in the header
  app.use(getUserFromToken);

  // this is used for health check pings
  app.get('/health', (req, resp) => resp.send(true));

  // setup graphql endpoints
  app.use('/graphql', graphql());

  if (config.environment !== Environment.PRODUCTION) {
    app.get('/graphiql', graphqlInteractive());
  }

  return app;
}

export async function startApi(port: number) {
  const app = getExpressApp();

  server = await new Promise((resolve, reject) => {
    const httpServer = app.listen(port, (err: any) => {
      if (err) {
        reject(err);
      }
      resolve(httpServer);
    });
  });
}

export async function stopApi() {
  return new Promise((resolve, reject) => {
    if (!server) {
      resolve();
    }

    server.close((err: any) => {
      if (err) {
        return reject(err);
      }
      server = null;
      resolve();
    });
  });
}
