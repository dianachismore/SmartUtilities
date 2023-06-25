import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Register from './Register';
import { useDispatch } from 'react-redux';
import { AllUsers, register } from '../redux/action';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('../redux/action', () => ({
  AllUsers: jest.fn(),
  register: jest.fn(),
}));

// Mock FormData
class MockFormData {
  constructor() {
    this.data = {};
  }

  append(key, value) {
    this.data[key] = value;
  }

  get(key) {
    return this.data[key];
  }
}

global.FormData = MockFormData;

describe('Register component', () => {
    it('renders correctly', () => {
        const { getByPlaceholderText, getByText } = render(
          <Register />
        );
    
        expect(getByPlaceholderText('Name')).toBeDefined();
        expect(getByPlaceholderText('Email')).toBeDefined();
        expect(getByPlaceholderText('Password')).toBeDefined();
        expect(getByPlaceholderText('Apartament Number')).toBeDefined();
        expect(getByText('Role')).toBeDefined();
        expect(getByText('Register')).toBeDefined();
        expect(getByText('Have an Account, Login')).toBeDefined();
      });
  it('dispatches register action on button press', async () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    const { getByPlaceholderText, getByText, findByText } = render(<Register />);
    const nameInput = getByPlaceholderText('Name');
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const apartamentNrInput = getByPlaceholderText('Apartament Number');
    const registerButton = getByText('Register');

    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(emailInput, 'john.doe@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(apartamentNrInput, '123');
    fireEvent.press(registerButton);

    await findByText('Have an Account, Login');

    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith(AllUsers());
    expect(mockDispatch).toHaveBeenCalledWith(register(expect.any(MockFormData)));
  });
});
