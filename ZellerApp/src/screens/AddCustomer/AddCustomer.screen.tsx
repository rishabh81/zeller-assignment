import { Text, View } from "react-native";
import Animated from 'react-native-reanimated';
import useAddCustomer from "./AddCustomer.hook";
import { useNavigation } from "@react-navigation/native";


const AddCustomer =() => {
    const navigation = useNavigation();
    const {
        control,
        errors,
        isSubmitting,
        validationRules,
        handleSubmit,
    } = useAddCustomer(() => navigation.goBack())
    return <View>
        <Text>Add customer</Text>
    </View>
}
export default AddCustomer;