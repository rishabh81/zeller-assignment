import {useForm} from 'react-hook-form';
import { Alert } from 'react-native';
import { IFormData, UserRole } from '../../types';
import { databaseService } from '../../services/database/DatabaseService';
const useAddCustomer =(onSuccess: () => void) => {

    const form =  useForm({
        defaultValues: {
            name:'',
            email:'',
            role: UserRole.Manager
        }
    });

    const {
        control,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
        }
    } = form;

    const onSubmit = async (data: IFormData) => {
        try {
            await databaseService.addCustomer({
                id: Math.random()+'',
                name: data.name.trim(),
                email: data.email.trim(),
                role: data.role,
            });
            Alert.alert('Success', 'Customer added successfully', [
                {text:'ok', onPress: onSuccess}
            ]);
        } catch(error) {
            console.error('Failed to add the customer', error);
            Alert.alert('Error', 'Failed to add the customer');
        }
    }

    const validationRules = {
        firstName: {
            required: 'Name is required',
            maxLength: {
                value: 35,
                message: 'Name must not exceed 25 characters',
            },
            pattern: {
                values: /^[a-zA-Z]+$/,
                message: 'Name must only contain alphabets'
            }
        },
        email: {
            pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                message: 'Please enter a valid email address' 
            }
        }
    }

    return {
        control,
        errors,
        isSubmitting,
        validationRules,
        handleSubmit: handleSubmit(onSubmit)
    }

}
export default useAddCustomer;