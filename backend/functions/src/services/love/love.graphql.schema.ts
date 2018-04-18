import * as fs from 'fs';
import * as path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { loveResolver } from './love.graphql.resolver';

export const loveSchema = makeExecutableSchema({
  typeDefs: fs.readFileSync(path.join(__dirname, 'love.graphql.typedefs.gql'), 'utf8'),
  resolvers: [loveResolver]
});
