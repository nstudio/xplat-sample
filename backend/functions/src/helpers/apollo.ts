import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';

let apolloClient: ApolloClient<NormalizedCacheObject>;
let apiToken: string;

function setContextHandler(foo: any, { headers }: any) {
  return {
    headers: {
      ...headers,
      authorization: apiToken ? `Bearer ${apiToken}` : ''
    }
  };
}

export function initApiClient(apiUrl: string, token?: string) {
  apiToken = token;

  const httpLink = createHttpLink({ uri: apiUrl });
  const authLink = setContext(setContextHandler);

  apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });

  return apolloClient;
}

export function updateApiToken(token: string) {
  apiToken = token;
}

export function api(): ApolloClient<NormalizedCacheObject> {
  if (!apolloClient) {
    throw new Error('You must call initApiClient() before accessing the api');
  }

  return apolloClient;
}
