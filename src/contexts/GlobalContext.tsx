import React, { createContext, useContext, useState } from "react";
import { mockParams } from "../data/mockParams";

const GlobalContext = createContext({ selectedOpsSection: 0, setSelectedOpsSection: (number) => {}, appParams: mockParams });

const GlobalProvider = ({ children, appParams }) => {
  const [selectedOpsSection, setSelectedOpsSection] = useState(0);

  return <GlobalContext.Provider value={{ selectedOpsSection, setSelectedOpsSection, appParams }}>{children}</GlobalContext.Provider>;
};

const useGlobal = () => {
  const globalContext = useContext(GlobalContext);

  if (!globalContext) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }

  return globalContext;
};

export { GlobalProvider, useGlobal };
