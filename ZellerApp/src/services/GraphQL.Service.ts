import {ApolloClient, InMemoryCache, gql, HttpLink} from '@apollo/client';
import { IZellerCustomerResponse, IFetchCustomersResult } from '../types';

const httpLink = new HttpLink({
    uri: 'http://192.168.1.16:9002/graphql',
    fetch: (uri, options) => {
      return fetch(uri, {
        ...options,
        headers: {
          ...options?.headers,
          'Content-Type': 'application/json',
          'apollo-require-preflight': 'true',
        },
      });
    },
  });

export const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});
const LIST_ZELLER_CUSTOMER = gql`
    query ListZellerCustomers{
        listZellerCustomers {
            items {
                id
                name
                email
                role        
            }
            nextToken
        }
    }
`

export const fetchCustomers = async (): Promise<IFetchCustomersResult> => {
    const {data, error, loading} = await apolloClient.query<{
        listZellerCustomers: IZellerCustomerResponse
    } >({
        query:LIST_ZELLER_CUSTOMER,
        fetchPolicy: 'network-only',
    })

    return {
        customerListData: data ? data.listZellerCustomers : null,
        customerListError:error,
        constomerLoading: loading
    }
}