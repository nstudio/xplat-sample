import * as fs from 'fs';
import * as path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { gatheringResolver } from './gathering.graphql.resolver';

export const gatheringSchema = makeExecutableSchema({
  typeDefs: fs.readFileSync(path.join(__dirname, 'gathering.graphql.typedefs.gql'), 'utf8'),
  resolvers: [gatheringResolver]
});
