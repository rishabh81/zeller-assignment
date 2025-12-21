import { useCallback, useEffect } from "react"
import { fetchCustomers } from "../../services/GraphQL.Service";
import { databaseService } from "../../services/database/DatabaseService";

export const useCustomerList = () => {

    const loadCustomers = useCallback( async () => {
        try {
            const localCustomers = await databaseService.getAllCustomers();
            console.log('localCustomers', localCustomers);
        } catch(e) {
            console.error('Failed to load customers', e);
        }
    }, [])

    const syncWithData = useCallback(async () => {
        const {customerListData, customerListError} = await fetchCustomers();
        if(customerListError) {
            // erorr handling
        }
        if(customerListData) {
            console.log('customerListData', customerListData);
            await databaseService.insertCustomers(customerListData.items);
            await loadCustomers();
        }
    }, []);

    const handleSearch = useCallback(() => {

    }, []);

    const handlePageChange = useCallback(() => {

    }, []);

    useEffect(() => {
        const initializeServiceData = async () => {
            await syncWithData();
        };
        console.log('getting data');
        initializeServiceData();
    }, []);

    return {

    }
}