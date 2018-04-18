import { v4 as uuid } from 'uuid';
import { mergeSchemas } from 'graphql-tools';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { logger, config } from '../helpers';
import { donationSchema, gatheringSchema, loveSchema, sketchSchema, sponsoredSchema, tagSchema, userSchema } from '../services';

const schemas = [donationSchema, gatheringSchema, loveSchema, sketchSchema, sponsoredSchema, tagSchema, userSchema];

export function graphql() {
  return graphqlExpress((req: any) => {
    return {
      schema: mergeSchemas({ schemas: schemas }),
      context: {
        rid: `api-${uuid()}`,
        headers: req.headers,
        currentUser: req.currentUser
      },
      formatError: (err: any) => {
        logger.error(err);
        return {
          message: err.message || 'There was an error processing the request.',
          path: err.path
        };
      }
    };
  });
}

export function graphqlInteractive() {
  return graphiqlExpress({ endpointURL: config.apiBaseUrl + '/graphql' });
}
