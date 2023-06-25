import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChangePassword from './ChangePassword';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

// Create a mock store
const mockStore = configureStore([]);

describe('ChangePassword Component', () => {
  let store;
  let component;
  let mockDispatch;

  beforeEach(() => {
    // Initialize the store with initial state if needed
    store = mockStore({});

    // Create a mock dispatch function
    mockDispatch = jest.fn();

    // Render the component with the mock store and dispatch function
    component = render(
      <Provider store={store}>
        <ChangePassword dispatch={mockDispatch} />
      </Provider>
    );
  });

  it('should render correctly', () => {
    expect(component).toMatchSnapshot();
  });

  it('should update oldPassword state when typing in the Old Password input', () => {
    const oldPasswordInput = component.getByPlaceholderText('Old Password');
    fireEvent.changeText(oldPasswordInput, 'oldPassword123');

    // Verify if the oldPassword state has been updated correctly
    expect(oldPasswordInput.props.value).toBe('oldPassword123');
  });

  it('should update newPassword state when typing in the New Password input', () => {
    const newPasswordInput = component.getByPlaceholderText('New Password');
    fireEvent.changeText(newPasswordInput, 'newPassword123');

    // Verify if the newPassword state has been updated correctly
    expect(newPasswordInput.props.value).toBe('newPassword123');
  });

});
