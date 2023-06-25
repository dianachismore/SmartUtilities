import React, { createContext, useState } from 'react';

const PaymentContext = createContext();

const PaymentProvider = ({ children }) => {
  const [paymentHistory, setPaymentHistory] = useState([]);

  const addPayment = (payment) => {
    setPaymentHistory((prevHistory) => [...prevHistory, payment]);
  };

  return (
    <PaymentContext.Provider value={{ paymentHistory, addPayment }}>
      {children}
    </PaymentContext.Provider>
  );
};

export { PaymentContext, PaymentProvider };
