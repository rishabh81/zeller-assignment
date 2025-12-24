import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { colors } from "../theme/colors";

interface IButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    loadingText?: string;
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}
export const Button: React.FC<IButtonProps> = ({
    disabled,
    loading,
    loadingText,
    title,
    fullWidth,
    style,
    textStyle,
    onPress
}) => {
    const isDisabled = disabled || loading;
    const displayText = loading ? loadingText : title
    return (
        <TouchableOpacity
        style={[
            styles.button,
            fullWidth && styles.fullWidth,
            isDisabled && styles.disabled,
            style
        ]}
        onPress={onPress}
        disabled={disabled}>
            <Text style={[styles.text, textStyle]}>{displayText}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button:{
        height:50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    fullWidth:{
        alignSelf: 'stretch'
    },
    primary:{},
    disabled: {
        backgroundColor: colors.disabled,
        borderColor: colors.disabled
    },
    text:{
        fontSize: 18,
        color: colors.white
    },

});