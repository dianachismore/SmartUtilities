import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { authReducer, messageReducer, postReducer, cardReducer } from "./reducer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, postReducer);


export const store = configureStore({
  reducer: {
    auth: authReducer,
    message: messageReducer,
    post: persistedReducer,
    card: cardReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export const persistor = persistStore(store);
