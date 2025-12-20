import {ApolloClient, InMemoryCache, gql, HttpLink} from '@apollo/client';

const httpLink = new HttpLink({
    uri: 'http://localhost:9002/graphql'
});

export const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
})