import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Footer from './Footer';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe('Footer', () => {
  it('should navigate to admin page when role is administrator', () => {
    const navigate = jest.fn();
    const useNavigationMock = jest.spyOn(require('@react-navigation/native'), 'useNavigation');
    useNavigationMock.mockReturnValue({ navigate });

    const useSelectorMock = jest.spyOn(require('react-redux'), 'useSelector');
    useSelectorMock.mockReturnValue({ user: { role: 'administrator' }, loading: false });

    const { getByTestId } = render(<Footer />);

    fireEvent.press(getByTestId('creditcard-button'));

    expect(navigate).toHaveBeenCalledWith('adminpage');
  });

  it('should navigate to landlord page when role is landlord', () => {
    const navigate = jest.fn();
    const useNavigationMock = jest.spyOn(require('@react-navigation/native'), 'useNavigation');
    useNavigationMock.mockReturnValue({ navigate });

    const useSelectorMock = jest.spyOn(require('react-redux'), 'useSelector');
    useSelectorMock.mockReturnValue({ user: { role: 'landlord' }, loading: false });

    const { getByTestId } = render(<Footer />);

    fireEvent.press(getByTestId('creditcard-button'));

    expect(navigate).toHaveBeenCalledWith('landlordpage');
  });

  it('should navigate to payment page when role is neither administrator nor landlord', () => {
    const navigate = jest.fn();
    const useNavigationMock = jest.spyOn(require('@react-navigation/native'), 'useNavigation');
    useNavigationMock.mockReturnValue({ navigate });

    const useSelectorMock = jest.spyOn(require('react-redux'), 'useSelector');
    useSelectorMock.mockReturnValue({ user: { role: 'tenant' }, loading: false });

    const { getByTestId } = render(<Footer />);

    fireEvent.press(getByTestId('creditcard-button'));

    expect(navigate).toHaveBeenCalledWith('payment');
  });

  it('should navigate to home page when home button is pressed', () => {
    const navigate = jest.fn();
    const useNavigationMock = jest.spyOn(require('@react-navigation/native'), 'useNavigation');
    useNavigationMock.mockReturnValue({ navigate });

    const { getByTestId } = render(<Footer />);

    fireEvent.press(getByTestId('home-button'));

    expect(navigate).toHaveBeenCalledWith('home');
  });

  it('should navigate to profile page when profile button is pressed', () => {
    const navigate = jest.fn();
    const useNavigationMock = jest.spyOn(require('@react-navigation/native'), 'useNavigation');
    useNavigationMock.mockReturnValue({ navigate });

    const { getByTestId } = render(<Footer />);

    fireEvent.press(getByTestId('profile-button'));

    expect(navigate).toHaveBeenCalledWith('profile');
  });
});
