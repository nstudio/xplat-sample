import * as fs from 'fs';
import * as path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { donationResolver } from './donation.graphql.resolver';

export const donationSchema = makeExecutableSchema({
  typeDefs: fs.readFileSync(path.join(__dirname, 'donation.graphql.typedefs.gql'), 'utf8'),
  resolvers: [donationResolver]
});
