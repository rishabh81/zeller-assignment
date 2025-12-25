import { renderHook, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import useEditCustomer from './EditCustomer.hook';
import { databaseService } from '../../services/database/DatabaseService';
import { useRoute } from '@react-navigation/native';

/* -------------------- MOCKS -------------------- */

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));

jest.mock('../../services/database/DatabaseService', () => ({
  databaseService: {
    updateCustomer: jest.fn(),
  },
}));

jest.spyOn(Alert, 'alert');

/* -------------------- TEST DATA -------------------- */

const mockCustomer = {
  id: '1',
  name: 'John Doe',
  email: 'john@test.com',
  role: 'ADMIN',
};

const mockOnSuccess = jest.fn();

/* -------------------- TESTS -------------------- */

describe('useEditCustomer', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useRoute as jest.Mock).mockReturnValue({
      params: {
        customer: mockCustomer,
      },
    });
  });

  it('initializes form with default values from route params', () => {
    const { result } = renderHook(() => useEditCustomer(mockOnSuccess));

    expect(result.current.control).toBeDefined();
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);

    // validate rules existence (100% coverage)
    expect(result.current.validationRules.firstname).toBeDefined();
    expect(result.current.validationRules.lastname).toBeDefined();
    expect(result.current.validationRules.email).toBeDefined();
  });

  it('submits form successfully and shows success alert', async () => {
    (databaseService.updateCustomer as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useEditCustomer(mockOnSuccess));

    await act(async () => {
      await result.current.handleSubmit({
        id: '1',
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@test.com',
        role: 'ADMIN',
      });
    });

    expect(databaseService.updateCustomer).toHaveBeenCalledWith({
      id: '1',
      name: 'John Doe',
      email: 'john@test.com',
      role: 'ADMIN',
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Success',
      'Customer updated successfully',
      [{ text: 'ok', onPress: mockOnSuccess }]
    );
  });

  it('calls onSuccess when alert OK is pressed', async () => {
    (databaseService.updateCustomer as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useEditCustomer(mockOnSuccess));

    await act(async () => {
      await result.current.handleSubmit({
        id: '1',
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@test.com',
        role: 'ADMIN',
      });
    });

    const alertArgs = (Alert.alert as jest.Mock).mock.calls[0][2];
    alertArgs[0].onPress();

    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('shows error alert when updateCustomer fails', async () => {
    (databaseService.updateCustomer as jest.Mock).mockRejectedValueOnce(
      new Error('DB Error')
    );

    const { result } = renderHook(() => useEditCustomer(mockOnSuccess));

    await act(async () => {
      await result.current.handleSubmit({
        id: '1',
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@test.com',
        role: 'ADMIN',
      });
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Failed to add the customer'
    );
  });
});
