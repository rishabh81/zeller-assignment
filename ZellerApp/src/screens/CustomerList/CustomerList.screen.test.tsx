import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CustomerListScreen } from './CustomerList.screen';

// react-native-reanimated mock
jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  default: {
    View: 'Animated.View',
    Text: 'Animated.Text',
    Image: 'Animated.Image',
    ScrollView: 'Animated.ScrollView',
    createAnimatedComponent: (Component: any) => Component,
  },
  useSharedValue: () => ({ value: 0 }),
  useAnimatedStyle: () => ({}),
  withTiming: (v: any) => v,
  interpolate: () => 0,
  runOnJS: (fn: any) => fn,
}));

// PagerView
jest.mock('react-native-pager-view', () => {
  const React = require('react');
  const { View } = require('react-native');
  return ({ children }: any) => React.createElement(View, null, children);
});

// Navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    addListener: jest.fn(() => jest.fn()),
  }),
}));

// Tab animation hook
jest.mock('./tabAnimation.hook', () => ({
  useTabAnimation: () => ({ tabIndicatorStyle: {}, updateAnimation: jest.fn() }),
}));

// CustomerList hook
const mockUseCustomerList = jest.fn(() => ({
  sectionedCustomer: [{ title: 'A', data: [{ id: '1', name: 'Alice', role: 'Admin' }] }],
  deleteCustomer: jest.fn(),
  editCustomer: jest.fn(),
  tabs: ['All', 'Admin', 'Manager'],
  handlePageChange: jest.fn(),
  currentPage: 0,
  isSearchVisible: false,
  handleSearch: jest.fn(),
  handleSearchSubmit: jest.fn(),
  searchText: '',
  toggleSearch: jest.fn(),
  refreshing: false,
  onRefersh: jest.fn(),
  isLoading: false,
}));
jest.mock('./CustomerList.hook', () => ({
  useCustomerList: () => mockUseCustomerList(),
}));

// CustomerCard
jest.mock('./CustomerCard.component', () => {
  const React = require('react');
  const { Text, View } = require('react-native');

  return ({ customerData, onDelete, onEdit }: any) =>
    React.createElement(
      View,
      null,
      React.createElement(Text, { testID: `customer-${customerData.id}` }, customerData.name),
      React.createElement(Text, { testID: `edit-${customerData.id}`, onPress: onEdit }, 'Edit'),
      React.createElement(Text, { testID: `delete-${customerData.id}`, onPress: onDelete }, 'Delete')
    );
});

describe('CustomerListScreen', () => {
  it('renders tabs', () => {
    const { getByText } = render(<CustomerListScreen />);
    expect(getByText('All')).toBeTruthy();
    expect(getByText('Admin')).toBeTruthy();
    expect(getByText('Manager')).toBeTruthy();
  });

  it('renders customer item', () => {
    const { getAllByTestId } = render(<CustomerListScreen />);
    expect(getAllByTestId('customer-1').length).toBeGreaterThan(0);
  });

  it('submits search input', () => {
    // override hook to show search input
    const handleSearch = jest.fn();
    const handleSearchSubmit = jest.fn();
    mockUseCustomerList.mockReturnValueOnce({
      sectionedCustomer: [{ title: 'A', data: [{ id: '1', name: 'Alice', role: 'Admin' }] }],
      deleteCustomer: jest.fn(),
      editCustomer: jest.fn(),
      tabs: ['All', 'Admin', 'Manager'],
      handlePageChange: jest.fn(),
      currentPage: 0,
      isSearchVisible: true, // show search input
      handleSearch,
      handleSearchSubmit,
      searchText: '',
      toggleSearch: jest.fn(),
      refreshing: false,
      onRefersh: jest.fn(),
      isLoading: false,
    });

    const { getByPlaceholderText } = render(<CustomerListScreen />);
    const input = getByPlaceholderText('Search customers');

    fireEvent.changeText(input, 'john');
    fireEvent(input, 'submitEditing');

    expect(handleSearch).toHaveBeenCalledWith('john');
    expect(handleSearchSubmit).toHaveBeenCalled();
  });

  it('clears search on X press', () => {
    const handleSearch = jest.fn();
    const toggleSearch = jest.fn();
    mockUseCustomerList.mockReturnValueOnce({
      sectionedCustomer: [{ title: 'A', data: [{ id: '1', name: 'Alice', role: 'Admin' }] }],
      deleteCustomer: jest.fn(),
      editCustomer: jest.fn(),
      tabs: ['All', 'Admin', 'Manager'],
      handlePageChange: jest.fn(),
      currentPage: 0,
      isSearchVisible: true,
      handleSearch,
      handleSearchSubmit: jest.fn(),
      searchText: 'abc',
      toggleSearch,
      refreshing: false,
      onRefersh: jest.fn(),
      isLoading: false,
    });

    const { getByPlaceholderText, getByText } = render(<CustomerListScreen />);
    const input = getByPlaceholderText('Search customers');
    fireEvent.changeText(input, 'abc');
    fireEvent.press(getByText('X'));

    expect(toggleSearch).toHaveBeenCalled();
  });

  it('shows loading indicator', () => {
    mockUseCustomerList.mockReturnValueOnce({
      sectionedCustomer: [],
      deleteCustomer: jest.fn(),
      editCustomer: jest.fn(),
      tabs: ['All', 'Admin', 'Manager'],
      handlePageChange: jest.fn(),
      currentPage: 0,
      isSearchVisible: false,
      handleSearch: jest.fn(),
      handleSearchSubmit: jest.fn(),
      searchText: '',
      toggleSearch: jest.fn(),
      refreshing: false,
      onRefersh: jest.fn(),
      isLoading: true, // show loading
    });

    const { getByText } = render(<CustomerListScreen />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('navigates to AddCustomer on FAB press', () => {
    const { getByText } = render(<CustomerListScreen />);
    fireEvent.press(getByText('+'));
    expect(mockNavigate).toHaveBeenCalledWith('AddCustomer');
  });
});
