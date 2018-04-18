import * as fs from 'fs';
import * as path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { tagResolver } from './tag.graphql.resolver';

export const tagSchema = makeExecutableSchema({
  typeDefs: fs.readFileSync(path.join(__dirname, 'tag.graphql.typedefs.gql'), 'utf8'),
  resolvers: [tagResolver]
});
