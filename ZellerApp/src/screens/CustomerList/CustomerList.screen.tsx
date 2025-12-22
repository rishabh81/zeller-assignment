import { SectionList, StyleSheet, Text, TouchableOpacity, View, TextInput, RefreshControl } from "react-native"
import { useCustomerList } from "./CustomerList.hook";
import { RootStackParamList, ZellerCustomer } from "../../types";
import CustomerCard from "./CustomerCard.component";
import { colors } from "../../theme/colors";
import { useTabAnimation } from "./tabAnimation.hook";
import Animated from "react-native-reanimated";
import PagerView from "react-native-pager-view";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CustomerList'>

const AnimaterPageView = Animated.createAnimatedComponent(PagerView);

export const CustomerListScreen = () => {
    const {
        sectionedCustomer,
        deleteCustomer,
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
    } = useCustomerList();

    const navigation = useNavigation<NavigationProp>();

    const { tabIndicatorStyle, updateAnimation } = useTabAnimation();

    const onPageChange = (page: number) => {
        handlePageChange(page);
        updateAnimation(page);
    }

    const renderCustomer = ({ item }: { item: ZellerCustomer }) => (
        <CustomerCard
            customerData={item}
            onDelete={() => { // revisite to remove inline function
                deleteCustomer(item.id);
            }}
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
                <View style={styles.searchContainer}>
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
                            // onPageChange(0);
                            toggleSearch();
                        }}>
                            <Text style={styles.clearButtonText}>X</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : <View style={{ flexDirection: 'row', marginVertical: 10 }}>
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
            <AnimaterPageView
            style={{flex: 1}}
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
        backgroundColor: '#cecece'
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
    searchContainer: {

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
    }
});