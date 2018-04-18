import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { environment } from '@sketchpoints/core/environments/environment';
import { throwIfAlreadyLoaded } from '@sketchpoints/utils';
import { API_PROVIDERS, ApiUser } from './services';

@NgModule({
  imports: [ApolloModule, HttpLinkModule],
  providers: [...API_PROVIDERS]
})
export class ApiModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: ApiModule,
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    throwIfAlreadyLoaded(parentModule, 'ApiModule');
    const http = httpLink.create({ uri: environment.api_url });
    const auth = setContext((_, { headers }) => {
      // get the cached authentication token
      let token;
      if (ApiUser.token) {
        token = ApiUser.token.value;
        // should probably check validity here since user could reopen app without it relaunching but the token could now be expired
        // TODO: not sure how best to handle this scenario
        // we need an interceptor to handle this but how to do with Apollo?
      }
      // return the headers to the context so httpLink can read them
      // in this example we assume headers property exists
      // and it is an instance of HttpHeaders
      if (!token) {
        return {};
      } else {
        if (!headers) {
          headers = new HttpHeaders();
        }
        return {
          headers: headers.append('Authorization', `Bearer ${token}`)
        };
      }
    });

    apollo.create({
      link: auth.concat(http),
      cache: new InMemoryCache(),
      ...environment.api_options
    });
  }
}
