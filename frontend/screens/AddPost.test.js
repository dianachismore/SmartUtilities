import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AddPost from './AddPost';

const mockStore = configureStore([]);

describe('AddPost Component', () => {
  let store;
  let component;
  let mockNavigate;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: {
          name: 'John Doe',
          avatar: {
            url: 'https://example.com/avatar.png',
          },
        },
      },
      message: {
        loading: false,
        message: '',
        error: '',
      },
    });

    mockNavigate = jest.fn();

    component = (
      <Provider store={store}>
        <AddPost
          navigation={{ navigate: mockNavigate }}
          route={{ params: {} }}
        />
      </Provider>
    );
  });

  test('navigates to camera screen when "Choose a Photo" is pressed', () => {
    const { getByText } = render(component);

    const choosePhotoButton = getByText('Choose a Photo');

    fireEvent.press(choosePhotoButton);

    expect(mockNavigate).toHaveBeenCalledWith('camera', {
      addPost: true,
    });
  });

  test('sets the description after entering it in the input field', () => {
    const { getByPlaceholderText } = render(component);

    const descriptionInput = getByPlaceholderText('Description');

    fireEvent.changeText(descriptionInput, 'Testing the description');

    expect(descriptionInput.props.value).toBe('Testing the description');
  });
});