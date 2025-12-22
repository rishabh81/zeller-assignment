import { SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useCustomerList } from "./CustomerList.hook";
import { ZellerCustomer } from "../../types";
import CustomerCard from "./CustomerCard.component";

export const CustomerListScreen = () => {
    const {
        sectionedCustomer,
        deleteCustomer,
        tabs
    } = useCustomerList();

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
            <View style={styles.tabsContainer}>
                // tabs
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={styles.tab}
                        onPress={() =>{}}
                    >
                        <Text>{tab}</Text>
                    </TouchableOpacity>
                ))}
                // search
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
    tabsContainer:{},
    tab:{},
    tabText:{},
});