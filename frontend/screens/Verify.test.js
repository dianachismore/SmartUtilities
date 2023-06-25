import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Verify from './Verify';
import { useDispatch } from 'react-redux';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));
// Mock the verify action
const mockVerify = jest.fn();

describe('Verify Component', () => {
    it('renders correctly and allows input', () => {
        const { getByPlaceholderText } = render(<Verify />);
        const otpInput = getByPlaceholderText('OTP');
    
        expect(otpInput).toBeDefined();
    
        fireEvent.changeText(otpInput, '123456');
        expect(otpInput.props.value).toBe('123456');
      });
     
  it('dispatches the verify action on button press', () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    const { getByPlaceholderText, getByText } = render(<Verify />);
    const otpInput = getByPlaceholderText('OTP');
    const verifyButton = getByText('Verify');

    // Simulate user entering OTP
    fireEvent.changeText(otpInput, '123456');

    // Simulate user pressing the Verify button
    fireEvent.press(verifyButton);

    // Assert that the dispatch function is called
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    // Optional: You can assert the specific action dispatched if needed
    // expect(mockDispatch).toHaveBeenCalledWith(/* Action to dispatch */);
  });
});
