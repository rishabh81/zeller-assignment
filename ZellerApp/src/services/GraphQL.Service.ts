import {ApolloClient, InMemoryCache, gql, HttpLink} from '@apollo/client';
import { ZellerCustomerResponse, FetchCustomersResult } from '../types';

const httpLink = new HttpLink({
    uri: 'http://192.168.31.77:9002/graphql'
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

export const fetchCustomers = async (): Promise<FetchCustomersResult> => {
    const {data, error} = await apolloClient.query<{
        listZellerCustomers: ZellerCustomerResponse
    }>({
        query:LIST_ZELLER_CUSTOMER,
        fetchPolicy: 'network-only',
    });

    return {
        customerListData: data.listZellerCustomers,
        customerListError:error,
    }
}