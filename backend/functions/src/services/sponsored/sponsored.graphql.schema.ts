import * as fs from 'fs';
import * as path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { sponsoredResolver } from './sponsored.graphql.resolver';

export const sponsoredSchema = makeExecutableSchema({
  typeDefs: fs.readFileSync(path.join(__dirname, 'sponsored.graphql.typedefs.gql'), 'utf8'),
  resolvers: [sponsoredResolver]
});
