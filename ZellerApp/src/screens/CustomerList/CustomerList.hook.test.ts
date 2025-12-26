import { renderHook, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useCustomerList } from './CustomerList.hook';
import { EUserRole, IZellerCustomer } from '../../types';

/* -------------------------------------------------------------------------- */
/*                                   MOCKS                                    */
/* -------------------------------------------------------------------------- */

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn(),
  };
});

jest.mock('../../services/GraphQL.Service', () => ({
  fetchCustomers: jest.fn(),
}));

jest.mock('../../services/database/DatabaseService', () => ({
  databaseService: {
    getAllCustomers: jest.fn(),
    insertCustomers: jest.fn(),
    clearCustomer: jest.fn(),
    delteCustomer: jest.fn(),
  },
}));

jest.spyOn(Alert, 'alert');


const customers: IZellerCustomer[] = [
  { id: '1', name: 'Alice', email: 'a@test.com', role: EUserRole.Admin },
  { id: '2', name: 'Bob', email: 'b@test.com', role: EUserRole.Manager },
  { id: '3', name: 'Aaron', email: 'c@test.com', role: EUserRole.Admin },
];


describe('useCustomerList', () => {
  const mockNavigate = jest.fn();
  const mockAddListener = jest.fn((_event, cb) => {
    cb(); // trigger immediately
    return jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    require('@react-navigation/native').useNavigation.mockReturnValue({
      navigate: mockNavigate,
      addListener: mockAddListener,
    });

    require('../../services/database/DatabaseService').databaseService.getAllCustomers.mockResolvedValue(
      customers
    );

    require('../../services/GraphQL.Service').fetchCustomers.mockResolvedValue({
      customerListData: { items: customers },
      customerListError: null,
      constomerLoading: false,
    });
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });



  it('initializes and syncs customers on mount', async () => {
    const { result } = renderHook(() => useCustomerList());

    expect(result.current.isLoading).toBe(true);

    await act(async () => {});

    expect(result.current.isLoading).toBe(false);
    expect(result.current.sectionedCustomer.length).toBe(2); // A, B
  });


  it('filters customers by role tab', async () => {
    const { result } = renderHook(() => useCustomerList());

    await act(async () => {});

    act(() => {
      result.current.handlePageChange(1); // Admin
    });

    expect(result.current.sectionedCustomer.length).toBe(1);
    expect(result.current.sectionedCustomer[0].title).toBe('A');
  });

  it('filters customers by search text', async () => {
    const { result } = renderHook(() => useCustomerList());

    await act(async () => {});

    act(() => {
      result.current.handleSearch('bob');
    });

    expect(result.current.sectionedCustomer.length).toBe(1);
    expect(result.current.sectionedCustomer[0].data[0].name).toBe('Bob');
  });

  it('toggles search and clears text when closing', async () => {
    const { result } = renderHook(() => useCustomerList());

    await act(async () => {});

    act(() => {
      result.current.handleSearch('Alice');
      result.current.toggleSearch();
    });

    expect(result.current.isSearchVisible).toBe(true);

    act(() => {
      result.current.toggleSearch();
    });

    expect(result.current.searchText).toBe('');
  });

  it('submits search and hides search input', async () => {
    const { result } = renderHook(() => useCustomerList());

    act(() => {
      result.current.toggleSearch();
      result.current.handleSearchSubmit();
    });

    expect(result.current.isSearchVisible).toBe(false);
  });


  it('refreshes customers', async () => {
    const { result } = renderHook(() => useCustomerList());

    await act(async () => {
      await result.current.onRefersh();
    });

    expect(result.current.refreshing).toBe(false);
  });


  it('deletes customer on confirm', async () => {
    const db =
      require('../../services/database/DatabaseService').databaseService;

    (Alert.alert as jest.Mock).mockImplementation(
      (_title, _msg, buttons) => {
        buttons[0].onPress();
      }
    );

    const { result } = renderHook(() => useCustomerList());

    await act(async () => {
      result.current.deleteCustomer('1');
    });

    expect(db.delteCustomer).toHaveBeenCalledWith('1');
  });


  it('navigates to EditCustomer screen', async () => {
    const { result } = renderHook(() => useCustomerList());

    act(() => {
      result.current.editCustomer(customers[0]);
    });

    expect(mockNavigate).toHaveBeenCalledWith('EditCustomer', {
      customer: customers[0],
    });
  });


});
