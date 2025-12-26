import { StyleSheet, Text, TouchableHighlight, View } from "react-native"
import { IZellerCustomer } from "../../types"
import { capitalizeFirstLetter } from "../../utils/stringsUtils"
import { colors } from "../../theme/colors"

interface ICustomerCard {
    customerData: IZellerCustomer;
    onDelete: () => void;
    onEdit: () => void;
}
const CustomerCard: React.FC<ICustomerCard> = ({customerData, onDelete, onEdit}) => {
    const avatarText = capitalizeFirstLetter(customerData.name)
    return(
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.infoContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{avatarText}</Text>
                    </View>
                    <View style={styles.info}>
                        <Text>{customerData.name}</Text>
                    </View>
                </View>
                <View style={styles.toolbar}>
                    {customerData.role === 'Admin'&& <Text style={styles.roleText}>{customerData.role}</Text>}
                    <TouchableHighlight style={styles.CTAButton} onPress={onDelete}>
                        <Text style={styles.CTAText}>Del</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.CTAButton} onPress={onEdit}>
                        <Text style={styles.CTAText}>Edit</Text>
                    </TouchableHighlight>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical:10,
        borderBottomWidth:1,
        borderBottomColor: '#cecece'
    },
    content:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    infoContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        flex:7
    },
    avatar:{
        padding:10,
        backgroundColor: colors.blueLight,
    },
    avatarText:{
        color: colors.blueDark
    },
    info:{
        paddingHorizontal:10
    },
    toolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex:3,
    },
    roleBadge:{},
    roleText:{
        color: colors.disabled
    },
    CTAButton: {
        padding: 10,
        backgroundColor: colors.blueDark,
        marginHorizontal:5
    },
    CTAText: {
        color: colors.white,
    }
})

export default CustomerCard