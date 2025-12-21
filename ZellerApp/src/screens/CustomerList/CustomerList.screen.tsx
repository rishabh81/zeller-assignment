import { StyleSheet, Text, View } from "react-native"
import { useCustomerList } from "./CustomerList.hook";

export const CustomerListScreen = () => {
    useCustomerList();
    return (
        <View style={styles.container}>
            <Text>hhjakhj</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'red'
    },
});