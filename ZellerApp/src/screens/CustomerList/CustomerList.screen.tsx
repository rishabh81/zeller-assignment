import { SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useCustomerList } from "./CustomerList.hook";
import { ZellerCustomer } from "../../types";
import CustomerCard from "./CustomerCard.component";
import { colors } from "../../theme/colors";
import { useTabAnimation } from "./tabAnimation.hook";
import Animated from "react-native-reanimated";

export const CustomerListScreen = () => {
    const {
        sectionedCustomer,
        deleteCustomer,
        tabs,
        handlePageChange,
        currentPage,
    } = useCustomerList();

    const {tabIndicatorStyle, updateAnimation} = useTabAnimation();

    const renderCustomer = ({item}: {item: ZellerCustomer}) => (
        <CustomerCard
            customerData={item}
            onDelete={() => { // revisite to remove inline function
                deleteCustomer(item.id);
            }}
        />
    )

    const renderSectionHeader = ({section}: {section:{title: string}}) => {
        return (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', marginVertical:10}}>
                <View style={styles.tabsContainer}>
                    // tabs
                    {tabs.map((tab, index) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab]}
                            onPress={() =>{
                                handlePageChange(index);
                                updateAnimation(index);
                            }}
                        >
                            <Text style={styles.tabText}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                    <Animated.View style={[styles.tabIndicator, tabIndicatorStyle]} />
                </View>
            // search
                <View style={styles.searchSection}>
                    <Text>S</Text>
                </View>
            </View>
           <SectionList
            sections={sectionedCustomer}
            renderItem={renderCustomer}
            renderSectionHeader={renderSectionHeader}
           />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal:10
    },
    sectionHeader: {},
    sectionHeaderText:{},
    searchSection:{flex:2},
    tabsContainer:{
        flexDirection:'row',
        flex:8,
        backgroundColor:'#cecece'
    },
    tab:{
        borderRadius:20,
        width:'33.3%'
    },
    selectedTab: {
        borderWidth:1,
        backgroundColor: colors.blueLight,
        borderColor: colors.blueDark,
    },
    tabText:{
        // padding:10,
        alignSelf: 'center'
    },
    tabIndicator: {
        height:20,
        width:90,
        position:'absolute',
        backgroundColor:'#007aff40',
        borderWidth:1,
        borderColor: colors.blueDark,
        borderRadius:20,
    }
});