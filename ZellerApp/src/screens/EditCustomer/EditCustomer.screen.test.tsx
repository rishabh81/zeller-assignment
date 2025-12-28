import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditCustomer from './EditCustomer.screen';
import useEditCustomer from './EditCustomer.hook';
import { IFromTextInputProps } from '../../components/FormTextInput';
import { TextInputProps } from 'react-native';

interface IFromTextInputPropsTest extends IFromTextInputProps {
  name: string;
} 

// Mock React Navigation hooks
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
  useRoute: jest.fn(),
}));

// Mock EditCustomer hook
const mockHandleSubmit = jest.fn();
jest.mock('./EditCustomer.hook', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock FormTextInput
jest.mock('../../components/FormTextInput', () => {
  const React = require('react');
  const { TextInput } = require('react-native');
  return {
    FormTextInput: React.forwardRef((props: IFromTextInputPropsTest, ref: TextInputProps) => (
      <TextInput testID={props.name} {...props} ref={ref} />
    )),
  };
});

// Mock FormButtonGroup
jest.mock('../../components/FormButtonGroup', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    FormButtonGroup: (props: any) => <View testID="role">{props.options.join(',')}</View>,
  };
});

// Mock Button
jest.mock('../../components/Button', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Button: (props: any) => <Text testID="button" onPress={props.onPress}>{props.title}</Text>,
  };
});


describe('EditCustomer Screen', () => {
  beforeEach(() => {
    (useEditCustomer as jest.Mock).mockImplementation((onSuccess: () => void) => ({
      control: {},
      errors: {},
      isSubmitting: false,
      validationRules: {
        firstname: {},
        lastname: {},
        email: {},
      },
      handleSubmit: () => {
        mockHandleSubmit();
        onSuccess(); // simulate successful submit calling navigation.goBack
      },
    }));

    mockGoBack.mockClear();
    mockHandleSubmit.mockClear();
  });

  it('renders all form fields and title', () => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<EditCustomer />);

    expect(getByText('Update User')).toBeTruthy();
    expect(getByPlaceholderText('Enter firstname')).toBeTruthy();
    expect(getByPlaceholderText('Enter lastname')).toBeTruthy();
    expect(getByPlaceholderText('Enter email address')).toBeTruthy();
    expect(getByTestId('role')).toBeTruthy(); // FormButtonGroup mock
    expect(getByText('Update Customer')).toBeTruthy();
  });


  it('calls handleSubmit when Edit Customer button is pressed', () => {
    const { getByTestId } = render(<EditCustomer />);
    fireEvent.press(getByTestId('button'));
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('calls navigation.goBack on successful submit', () => {
    const { getByTestId } = render(<EditCustomer />);
    fireEvent.press(getByTestId('button'));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
