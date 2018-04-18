import * as fs from 'fs';
import * as path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { sketchResolver } from './sketch.graphql.resolver';

export const sketchSchema = makeExecutableSchema({
  typeDefs: fs.readFileSync(path.join(__dirname, 'sketch.graphql.typedefs.gql'), 'utf8'),
  resolvers: [sketchResolver]
});
