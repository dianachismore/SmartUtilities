import React from 'react';
import { render, fireEvent, waitFor  } from '@testing-library/react-native';
import { Provider } from 'react-redux'; // Assuming you have a Redux store provider
import Login from './Login';
import { useSelector, useDispatch } from 'react-redux';
import { AllUsers, login } from '../redux/action';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe('Login component', () => {
  beforeEach(() => {
    useSelector.mockClear();
    useDispatch.mockClear();
  });

  it('renders correctly', () => {
    useSelector.mockImplementation(selector => selector({
      auth: { error: null },
    }));

    const { getByPlaceholderText, getByText } = render(<Login />);

    expect(getByPlaceholderText('Email')).toBeDefined();
    expect(getByPlaceholderText('Password')).toBeDefined();
    expect(getByText('Login')).toBeDefined();
    expect(getByText('Or')).toBeDefined();
    expect(getByText('Sign Up')).toBeDefined();
    expect(getByText('Forget Password')).toBeDefined();
  });

  it('dispatches login action on button press', async () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    useSelector.mockImplementation(selector => selector({
      auth: { error: null },
    }));

    const { getByText, getByPlaceholderText } = render(<Login />);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Login');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(2);
      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
    });
  });

});
