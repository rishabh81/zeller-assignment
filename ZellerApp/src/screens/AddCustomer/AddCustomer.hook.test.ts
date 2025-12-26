import { renderHook, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import useAddCustomer from './AddCustomer.hook';
import { databaseService } from '../../services/database/DatabaseService';

// Mock database service
jest.mock('../../services/database/DatabaseService', () => ({
  databaseService: {
    addCustomer: jest.fn(),
  },
}));

// Mock react-hook-form (NO out-of-scope references)
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    handleSubmit: (cb: any) => {
      return async () =>
        cb({
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@test.com',
          role: 'Manager', // ✅ inline value, not enum
        });
    },
    formState: {
      errors: {},
      isSubmitting: false,
    },
  }),
}));

jest.spyOn(Alert, 'alert');
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('useAddCustomer', () => {
  const onSuccessMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useAddCustomer(onSuccessMock));

    expect(result.current.control).toBeDefined();
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.validationRules).toBeDefined();
  });

  it('submits customer successfully', async () => {
    (databaseService.addCustomer as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAddCustomer(onSuccessMock));

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(databaseService.addCustomer).toHaveBeenCalledWith({
      id: expect.any(String),
      name: 'John Doe',
      email: 'john@test.com',
      role: 'Manager',
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Success',
      'Customer added successfully',
      [{ text: 'ok', onPress: onSuccessMock }]
    );
  });

  it('shows error alert when submission fails', async () => {
    (databaseService.addCustomer as jest.Mock).mockRejectedValueOnce(
      new Error('DB error')
    );

    const { result } = renderHook(() => useAddCustomer(onSuccessMock));

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Failed to add the customer'
    );
  });
});
