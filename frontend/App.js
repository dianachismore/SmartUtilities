import React from 'react'
import Main from "./Main";
import { Provider } from "react-redux";
import {store, persistor} from "./redux/store";
import { PersistGate } from 'redux-persist/integration/react';
import {LogBox} from 'react-native'
import { PaymentProvider } from './components/PaymentContext'
import { ContractProvider } from './components/ContractContext'

export default function App() {
  LogBox.ignoreAllLogs();
  return (
    <Provider store={store}>
      <PaymentProvider>
      <ContractProvider>
        <PersistGate loading={null} persistor={persistor}>
          <Main />
        </PersistGate>
        </ContractProvider>
        </PaymentProvider>
    </Provider>
  );
}