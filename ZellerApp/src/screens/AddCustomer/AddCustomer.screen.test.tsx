import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddCustomer from './AddCustomer.screen';

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

const mockHandleSubmit = jest.fn();

const mockUseAddCustomer = jest.fn();

jest.mock('./AddCustomer.hook', () => ({
  __esModule: true,
  default: (onSuccess: () => void) => {
    mockUseAddCustomer(onSuccess);
    return {
      control: {},
      errors: {},
      isSubmitting: false,
      validationRules: {},
      handleSubmit: mockHandleSubmit,
    };
  },
}));

jest.mock('../../components/FormTextInput', () => {
  const React = require('react');
  return {
    FormTextInput: ({ placeholder, onSubmitEditing }: any) =>
      React.createElement(
        'Text',
        { onPress: onSubmitEditing },
        placeholder
      ),
  };
});

jest.mock('../../components/FormButtonGroup', () => {
  const React = require('react');
  return {
    FormButtonGroup: () =>
      React.createElement('Text', null, 'Role Selector'),
  };
});

jest.mock('../../components/Button', () => {
  const React = require('react');
  return {
    Button: ({ title, onPress }: any) =>
      React.createElement(
        'Text',
        { onPress },
        title
      ),
  };
});

jest.mock('../../components/FormTextInput', () => {
    const React = require('react');
    return {
      FormTextInput: ({ placeholder, onSubmitEditing }: any) =>
        React.createElement(
          'Text',
          { onPress: onSubmitEditing },
          placeholder
        ),
    };
  });
  

describe('AddCustomer Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields and title', () => {
    const { getByText } = render(<AddCustomer />);

    expect(getByText('New User')).toBeTruthy();
    expect(getByText('Enter firstname')).toBeTruthy();
    expect(getByText('Enter lastname')).toBeTruthy();
    expect(getByText('Enter email address')).toBeTruthy();
    expect(getByText('Role Selector')).toBeTruthy();
  });

  it('triggers focus handlers', () => {
    const { getByText } = render(<AddCustomer />);
  
    fireEvent.press(getByText('Enter firstname'));
    fireEvent.press(getByText('Enter lastname'));
  });

  it('calls handleSubmit when Add Customer is pressed', () => {
    const { getByText } = render(<AddCustomer />);

    fireEvent.press(getByText('Add Customer'));

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('navigates back on successful submit', () => {
    render(<AddCustomer />);

    const onSuccess = mockUseAddCustomer.mock.calls[0][0];
    onSuccess();

    expect(mockGoBack).toHaveBeenCalled();
  });
});
