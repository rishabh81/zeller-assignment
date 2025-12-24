import { FieldError } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../theme/colors";
import { withFormField } from "./withFormField";

interface IFromButtonGroupSelectProps<T> {
    value: T;
    onChangeText: (value: T) => void;
    options?: T[];
    error?: FieldError,
}

const ButtonGroupSelect = <T extends string>({
    value,
    onChangeText,
    options=[],
}: IFromButtonGroupSelectProps<T>) => {

    const handleOptionsChange =(option: T) => {
        onChangeText(option);
    }

    return (
        <View style={styles.roleContainer}>
            <View style={styles.buttonContainer}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[styles.roleButton, option===value && styles.roleButtonActiveIndicator]} //roleButtonActiveIndicator
                        onPress={() =>  handleOptionsChange(option)}
                    >
                        <Text 
                            style={[styles.roleButtonText, option===value && styles.roleButtonTextActive]}
                        >
                            {option}
                        </Text>

                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    roleContainer:{
        alignItems: 'center'
    },
    buttonContainer:{
        flexDirection:'row',
        backgroundColor: colors.lighGrey,
        borderRadius: 28,
        padding:4,
        width:248,
    },
    roleButton:{
        flex:1,
        height:42,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:2,
        borderRadius: 28,
    },
    selectedIndicator:{},
    roleButtonActiveIndicator:{
        backgroundColor: colors.blueLight,
        borderColor: colors.blueDark,
        borderWidth:1
    },
    roleButtonText:{
        fontSize: 16,
    },
    roleButtonTextActive:{
        color: colors.blueDark,
        fontWeight:'bold',
    },
});

export const FormButtonGroup = withFormField(ButtonGroupSelect);