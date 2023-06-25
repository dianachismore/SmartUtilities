import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ForgetPassword from './ForgetPassword';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

// Create a mock store
const mockStore = configureStore([]);

describe('ForgetPassword Component', () => {
  let store;
  let component;
  let mockDispatch;
  let navigationMock;

  beforeEach(() => {
    // Define the mock state with the loading property
    const mockState = { message: { loading: false } };

    // Initialize the store with the mock state
    store = mockStore(mockState);

    // Create a mock dispatch function
    mockDispatch = jest.fn();

    // Create a mock navigation object
    navigationMock = {
      navigate: jest.fn(),
    };

    // Render the component with the mock store, dispatch function, and navigation object
    component = render(
      <Provider store={store}>
        <ForgetPassword navigation={navigationMock} dispatch={mockDispatch} />
      </Provider>
    );
  });

  it('should render correctly', () => {
    expect(component).toMatchSnapshot();
  });

  it('should update email state when typing in the Email input', () => {
    const emailInput = component.getByPlaceholderText('Email');
    fireEvent.changeText(emailInput, 'test@example.com');

    // Verify if the email state has been updated correctly
    expect(emailInput.props.value).toBe('test@example.com');
  });

//   it('should dispatch forgetPassword action and navigate to resetpassword screen when Send Email button is pressed', async () => {
//     const sendEmailButton = component.getByText('Send Email');

//     // Set the email input value
//     const emailInput = component.getByPlaceholderText('Email');
//     fireEvent.changeText(emailInput, 'test@example.com');

//     // Invoke the onPress event handler manually
//     sendEmailButton.props.onPress();

//     // Verify if the dispatch function has been called with the expected action
//     expect(mockDispatch).toHaveBeenCalledWith(
//       forgetPassword('test@example.com')
//     );

//     // Verify if the navigate function has been called with the expected screen name
//     expect(navigationMock.navigate).toHaveBeenCalledWith('resetpassword');
//   });
});
