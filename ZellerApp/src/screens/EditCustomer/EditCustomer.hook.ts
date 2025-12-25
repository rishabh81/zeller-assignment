import {useForm} from 'react-hook-form';
import { Alert } from 'react-native';
import { IupdateFormData, ZellerCustomer } from '../../types';
import { databaseService } from '../../services/database/DatabaseService';
import { RouteProp, useRoute } from '@react-navigation/native';
const useEditCustomer =(onSuccess: () => void) => {
    const {params: {customer: {id, name, email, role}}} = useRoute<RouteProp<{params: {customer:ZellerCustomer}}, 'params'>>()
    const splitName = name.split(' ');
    const firstname = splitName[0];
    const lastname = splitName[1];
    const form =  useForm<IupdateFormData>({
        defaultValues: {
            id,
            firstname,
            lastname,
            email,
            role
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

    const onSubmit = async (data: IupdateFormData) => {
        try {
            await databaseService.updateCustomer({
                id: data.id,
                name: data.firstname.trim()+' '+data.lastname.trim(),
                email: data.email.trim(),
                role: data.role,
            });
            Alert.alert('Success', 'Customer updated successfully', [
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
export default useEditCustomer;