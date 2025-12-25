import { useCallback, useEffect, useMemo, useState } from "react"
import { fetchCustomers } from "../../services/GraphQL.Service";
import { databaseService } from "../../services/database/DatabaseService";
import { RootStackParamList, UserRole, UserType, ZellerCustomer } from "../../types";
import { Alert } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CustomerList'
>;


export const useCustomerList = () => {

    const [customers, setCustomers] = useState<ZellerCustomer[]>([]);
    const [searchText, setSearchText] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation<NavigationProp>();

    const tabs: UserType[] = ['All', UserRole.Admin, UserRole.Manager]

    const filteredCustomers = useMemo(() => {
        let filtered = customers;
        if(tabs[currentPage] !== 'All') {
            filtered = filtered.filter(customer => customer.role === tabs[currentPage]);
        }

        if(searchText.trim()) {
            filtered = filtered.filter(customer => 
                customer.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        return filtered;

    }, [customers, searchText, currentPage, tabs]);


    const sectionedCustomer = useMemo(() => {
        const groupedNames = filteredCustomers.reduce((acc, customer) => {
            const firstLetter = customer.name.charAt(0).toUpperCase();
            if(!acc[firstLetter]) {
                acc[firstLetter] = [];
            }
            acc[firstLetter].push(customer);
            return acc;
        }, {} as Record<string, ZellerCustomer[]>);

        const sectionListData = Object.keys(groupedNames)
        .sort()
        .map(letter =>({
            title: letter,
            data: groupedNames[letter].sort((a,b) => a.name.localeCompare(b.name)),
        }));

        return sectionListData;
    }, [filteredCustomers]);

    const loadCustomers = useCallback( async () => {
        try {
            const localCustomers = await databaseService.getAllCustomers();
            setCustomers(localCustomers); 
        } catch(e) {
            console.error('Failed to load customers', e);
        }
    }, [])

    const syncWithData = useCallback(async () => {
        setIsLoading(true);
        const {customerListData, customerListError, constomerLoading} = await fetchCustomers();
        setIsLoading(false);
        if(customerListError) {
            // erorr handling
            Alert.alert('Sync Error', 'Failed to sync whith server')
        }
        if(customerListData) {
            console.log('customerListData', customerListData);
            await databaseService.clearCustomer();
            await databaseService.insertCustomers(customerListData.items);
            await loadCustomers();
        }
    }, []);

    const handleSearch = useCallback((text: string) => {
        setSearchText(text);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const toggleSearch = () => {
        setIsSearchVisible((state) => !state);
        if(isSearchVisible && searchText) {
            handleSearch('');
        }
    };

    const handleSearchSubmit = () => {
        setIsSearchVisible(false);
    }

    const onRefersh = useCallback( async() => {
        setRefreshing(true);
        await syncWithData();
        setRefreshing(false);
    }, [syncWithData]);

    const deleteCustomer = useCallback( (id: string) => {

        Alert.alert('Are you sure', 'To delete customer', [
            {text:'Delete', onPress: async () => {
                try {
                    await databaseService.delteCustomer(id);
                    await loadCustomers();
                } catch(e) {
                    console.error('error while deleting customer', e);
                    Alert.alert('Error', 'Failed to delete customer');
                }
            }},
            {
                text: 'Cancel', onPress:() => null
            }
        ]);

    }, [loadCustomers, databaseService]);

    const editCustomer = useCallback((customer: ZellerCustomer) => {
        navigation.navigate('EditCustomer', {customer});
    },[])

    useEffect(() => {
        const initializeServiceData = async () => {
            await syncWithData();
        };
        initializeServiceData();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadCustomers();
        });
        return unsubscribe
    }, [loadCustomers, navigation]);

    return {
        sectionedCustomer,
        handleSearch,
        handlePageChange,
        onRefersh,
        tabs,
        currentPage,
        refreshing,
        searchText,
        deleteCustomer,
        editCustomer,
        toggleSearch,
        handleSearchSubmit,
        isSearchVisible,
        isLoading,
    }
}