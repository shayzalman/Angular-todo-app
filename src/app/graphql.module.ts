import {NgModule} from '@angular/core';
import {APOLLO_OPTIONS, ApolloModule} from 'apollo-angular';
import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {environment} from '@environments/environment';
import {ApolloLink, concat} from 'apollo-link';
import {HttpHeaders} from '@angular/common/http';

const uri = environment.baseUrl + 'api/gql'; // <-- add the URL of the GraphQL server here
const authMiddleware = new ApolloLink((operation, forward) => {
  const ls = JSON.parse(localStorage.getItem('currentUser'));
  operation.setContext({
    headers: new HttpHeaders().set('x-token', (ls && ls.accessToken) ? ls.accessToken : 'null')
  });
  return forward(operation);
});
export function createApollo(httpLink: HttpLink) {
  return {
    link: concat(authMiddleware, httpLink.create({uri})),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all'
      },
      mutate: {
        errorPolicy: 'all'
      }
    }
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
