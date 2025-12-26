import { SectionList, StyleSheet, Text, TouchableOpacity, View, TextInput, RefreshControl } from "react-native"
import { useCustomerList } from "./CustomerList.hook";
import { TRootStackParamList, IZellerCustomer } from "../../types";
import CustomerCard from "./CustomerCard.component";
import { colors } from "../../theme/colors";
import { useTabAnimation } from "./tabAnimation.hook";
import Animated from "react-native-reanimated";
import PagerView from "react-native-pager-view";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<TRootStackParamList, 'CustomerList'>

const AnimaterPageView = Animated.createAnimatedComponent(PagerView);

export const CustomerListScreen = () => {
    const {
        sectionedCustomer,
        deleteCustomer,
        editCustomer,
        tabs,
        handlePageChange,
        currentPage,
        isSearchVisible,
        handleSearch,
        handleSearchSubmit,
        searchText,
        toggleSearch,
        refreshing,
        onRefersh,
        isLoading,
    } = useCustomerList();
    const navigation = useNavigation<NavigationProp>();

    const { tabIndicatorStyle, updateAnimation } = useTabAnimation();

    const onPageChange = (page: number) => {
        handlePageChange(page);
        updateAnimation(page);
    }

    const renderCustomer = ({ item }: { item: IZellerCustomer }) => (
        <CustomerCard
            customerData={item}
            onDelete={() => { // revisite to remove inline function
                deleteCustomer(item.id);
            }}
            onEdit={() => editCustomer(item)}
        />
    )

    const renderSectionHeader = ({ section }: { section: { title: string } }) => {
        return (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {isSearchVisible ? (
                <View>
                    <View style={styles.searchInputContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder='Search customers'
                            value={searchText}
                            onChangeText={handleSearch}
                            onSubmitEditing={handleSearchSubmit}
                            autoFocus
                            returnKeyType='search'

                        />
                        <TouchableOpacity style={styles.clearButton} onPress={() => {
                            toggleSearch();
                        }}>
                            <Text style={styles.clearButtonText}>X</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : <View style={styles.topBar}>
                <View style={styles.tabsContainer}>
                    
                    {tabs.map((tab, index) => (
                        <TouchableOpacity
                            key={tab}
                            style={styles.tab}
                            onPress={() => {
                                onPageChange(index)
                            }}
                        >
                            <Text style={[styles.tabText, (currentPage === index) && styles.selectedTab]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                    <Animated.View style={[styles.tabIndicator, tabIndicatorStyle]} />
                </View>
            
                <View style={styles.searchSection}>
                    <Text onPress={toggleSearch}>S</Text>
                </View>
            </View>}
            {isLoading ?
             <Text style={styles.loadingText}>Loading...</Text>
             :
             <AnimaterPageView
             style={styles.pagerStyle}
             initialPage={0}
             onPageSelected={(e) => onPageChange(e.nativeEvent.position)}
             >
             {
                 tabs.map(tab => (
                     <View key={tab} style={styles.page}>
                       <SectionList
                             sections={sectionedCustomer}
                             renderItem={renderCustomer}
                             renderSectionHeader={renderSectionHeader}
                             refreshControl={
                                 <RefreshControl refreshing={refreshing} onRefresh={onRefersh} />
                             }
                         />
                     </View>
                 ))
             }
         </AnimaterPageView>
             }

            
            <TouchableOpacity style={styles.fab} onPress={() => {navigation.navigate('AddCustomer')}}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10
    },
    sectionHeader: {},
    sectionHeaderText: {},
    searchSection: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabsContainer: {
        flexDirection: 'row',
        flex: 8,
        backgroundColor: colors.grey,
        borderRadius: 20,
    },
    tab: {
        borderRadius: 20,
        width: '33.3%',
        paddingVertical:5,
        paddingHorizontal:10,
    },
    selectedTab: {
        color: colors.blueDark,
    },
    tabText: {
        alignSelf: 'center'
    },
    tabIndicator: {
        height: 30,
        width: 90,
        position: 'absolute',
        backgroundColor: '#007aff40',
        borderWidth: 1,
        borderColor: colors.blueDark,
        borderRadius: 20,
    },
    pagerStyle: {
        flex:1
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchInput: {

    },
    clearButton: {
        position: 'absolute',
        right: 0,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButtonText: {

    },
    topBar: { 
        flexDirection: 'row', 
        marginVertical: 10 
    },
    page: {
        height: '100%'
    },
    fab:{
        position:'absolute',
        right:20,
        bottom:20,
        height:60,
        width:60,
        borderRadius: 5,
        backgroundColor: colors.blueDark,
        justifyContent:'center',
        alignItems:'center',
    },
    fabText: {
        color: '#fff',
        fontSize: 24
    },
    loadingText: {
        alignSelf: 'center'
    }
});