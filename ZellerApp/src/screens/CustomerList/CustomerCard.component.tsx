import { StyleSheet, Text, TouchableHighlight, View } from "react-native"
import { ZellerCustomer } from "../../types"
import { capitalizeFirstLetter } from "../../utils/strings"
import { colors } from "../../theme/colors"

interface ICustomerCard {
    customerData: ZellerCustomer,
    onDelete: () => void,
}
const CustomerCard: React.FC<ICustomerCard> = ({customerData, onDelete}) => {
    const avatarText = capitalizeFirstLetter(customerData.name)
    return(
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{avatarText}</Text>
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.name}>{customerData.name}</Text>
                    </View>
                </View>
                <View style={styles.toolbar}>
                    <TouchableHighlight>
                        <Text>D</Text>
                    </TouchableHighlight>
                    {customerData.role === 'Admin'&& <Text>{customerData.role}</Text>}
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical:10,
        // marginBottom:10,
        borderBottomWidth:1,
        borderBottomColor: '#cecece'
    },
    content:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
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
    name:{},
    email:{},
    toolbar: {flexDirection: 'row'},
    roleBadge:{},
    roleText:{},
    deleteButton: {},
    deleteText:{}
})

export default CustomerCard