import { StyleSheet, TextInput, TextInputProps } from "react-native"
import { colors } from "../theme/colors";
import { FieldError } from "react-hook-form";
import { withFormField } from "./withFormField";

export interface  IFromTextInputProps extends TextInputProps{
    error?: FieldError,
}

const BaseTextInput :React.FC<IFromTextInputProps> = ({error, style, ...prpos}) => {
    return (
        <TextInput
            style={[styles.input, error && styles.inputError, style]}
            {...prpos}
        />
    )
};

export const FormTextInput = withFormField(BaseTextInput);

const styles = StyleSheet.create({
    input:{
        height:50,
        borderBottomWidth: 1,
        borderColor: colors.border,
        fontSize: 16,
        backgroundColor: colors.white
    },
    inputError: {
        borderColor: colors.error
    },
})