import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import useEditCustomer from "./EditCustomer.hook";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { FormTextInput } from "../../components/FormTextInput";
import { FormButtonGroup } from "../../components/FormButtonGroup";
import { EUserRole } from "../../types";
import { Button } from "../../components/Button";
import { useRef } from "react";


const EditCustomer = () => {
    const navigation = useNavigation();
    const {
        control,
        errors,
        isSubmitting,
        validationRules,
        handleSubmit,
    } = useEditCustomer(() => navigation.goBack());

    const lastNameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    return <View style={styles.container}>
            <ScrollView style={styles.container}>
                <View style={styles.form}>
                    <Text style={styles.formTitle}>Update User</Text>
                    <FormTextInput
                        name='firstname'
                        control={control}
                        rules={validationRules.firstname}
                        error={errors.firstname}
                        placeholder='Enter firstname'
                        maxLength={25}
                        onSubmitEditing={() => lastNameRef.current?.focus()}
                        required
                    />
                    <FormTextInput
                        ref={lastNameRef}
                        name='lastname'
                        control={control}
                        rules={validationRules.lastname}
                        error={errors.lastname}
                        placeholder='Enter lastname'
                        maxLength={24}
                        onSubmitEditing={() => emailRef.current?.focus()}
                        required
                    />
                    <FormTextInput
                        ref={emailRef}
                        name='email'
                        control={control}
                        rules={validationRules.email}
                        error={errors.email}
                        placeholder='Enter email address'
                        keyboardType='email-address'
                        autoCapitalize="none"
                        required
                    />

                    <FormButtonGroup
                        name='role'
                        testID='role'
                        control={control}
                        error={errors.role}
                        options={[EUserRole.Admin, EUserRole.Manager]}
                        required
                    />
                </View>

            </ScrollView>
            <Button
                title='Edit Customer'
                onPress={handleSubmit}
                loading={isSubmitting}
                loadingText='Adding...'
                style={styles.submitButton}
                fullWidth
            />
        </View>
}
export default EditCustomer;

const styles = StyleSheet.create({
    formTitle: {
        fontSize: 24,
        fontWeight: 'black',
        marginBottom: 20,
    },
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    form: {
        padding: 20,
    },
    submitButton: {
        marginHorizontal:20,
        backgroundColor: colors.blueDark,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonDisabled: {
        backgroundColor: colors.disabled
    },
    submitButtonText: {
        color: colors.blueLight,
        fontSize: 18,
    }
})