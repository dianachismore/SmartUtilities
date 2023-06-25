import React, { createContext, useState } from 'react';

export const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [renterIdData, setRenterIdData] = useState(null);
  const [landlordIdData, setLandlordIdData] = useState(null);

  return (
    <ContractContext.Provider
      value={{
        renterIdData,
        setRenterIdData,
        landlordIdData,
        setLandlordIdData,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};
