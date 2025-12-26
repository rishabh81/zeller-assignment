import {useForm} from 'react-hook-form';
import { Alert } from 'react-native';
import { IFormData, EUserRole } from '../../types';
import { databaseService } from '../../services/database/DatabaseService';
const useAddCustomer =(onSuccess: () => void) => {

    const form =  useForm<IFormData>({
        defaultValues: {
            firstname:'',
            lastname: '',
            email:'',
            role: EUserRole.Manager
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
                name: data.firstname.trim()+' '+data.lastname.trim(),
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
        firstname: {
            required: 'firstname is required',
            maxLength: {
                value: 25,
                message: 'lastname must not exceed 25 characters',
            },
            pattern: {
                value: /^[a-zA-Z]+$/,
                message: 'Name must only contain alphabets'
            }
        },
        lastname: {
            required: 'Name is required',
            maxLength: {
                value: 24,
                message: 'Name must not exceed 24 characters',
            },
            pattern: {
                value: /^[a-zA-Z]+$/,
                message: 'Name must only contain alphabets'
            }
        },
        email: {
            required: 'Email is required',
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