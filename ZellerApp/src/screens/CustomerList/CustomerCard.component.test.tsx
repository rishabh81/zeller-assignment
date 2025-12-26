// src/components/CustomerCard/CustomerCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomerCard from './CustomerCard.component';
import { ZellerCustomer } from '../../types';

describe('CustomerCard', () => {
  const mockDelete = jest.fn();
  const mockEdit = jest.fn();

  const customer: ZellerCustomer = {
    id: '1',
    name: 'Alice',
    role: 'Admin',
  };

  const customerNonAdmin: ZellerCustomer = {
    id: '2',
    name: 'Bob',
    role: 'Manager',
  };

  it('renders customer name correctly', () => {
    const { getByText } = render(
      <CustomerCard customerData={customer} onDelete={mockDelete} onEdit={mockEdit} />
    );

    expect(getByText('Alice')).toBeTruthy();
  });

  it('renders role text only for Admin', () => {
    const { getByText, queryByText } = render(
      <CustomerCard customerData={customer} onDelete={mockDelete} onEdit={mockEdit} />
    );

    expect(getByText('Admin')).toBeTruthy();

    const { queryByText: queryNonAdmin } = render(
      <CustomerCard customerData={customerNonAdmin} onDelete={mockDelete} onEdit={mockEdit} />
    );

    expect(queryNonAdmin('Manager')).toBeNull(); // role badge should not render
  });

  it('calls onDelete when delete button is pressed', () => {
    const { getByText } = render(
      <CustomerCard customerData={customer} onDelete={mockDelete} onEdit={mockEdit} />
    );

    fireEvent.press(getByText('Del'));
    expect(mockDelete).toHaveBeenCalledTimes(1);
  });

  it('calls onEdit when edit button is pressed', () => {
    const { getByText } = render(
      <CustomerCard customerData={customer} onDelete={mockDelete} onEdit={mockEdit} />
    );

    fireEvent.press(getByText('Edit'));
    expect(mockEdit).toHaveBeenCalledTimes(1);
  });

  it('displays the avatar text correctly', () => {
    const { getByText } = render(
      <CustomerCard customerData={customer} onDelete={mockDelete} onEdit={mockEdit} />
    );

    // Avatar should show first letter of the name capitalized
    expect(getByText('A')).toBeTruthy();
  });
});
