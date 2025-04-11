import React, { createContext, useContext, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { getOperationSections } from "../queries/operationSection";

const DataContext = createContext({
  operationSections: [],
  operationSectionsPending: false
});

const DataProvider = ({ children, recordInfo }) => {
  const { id, sectionType, questionRelName } = recordInfo;

  const {
    isPending: operationSectionsPending,
    error,
    data: operationSections,
  } = useQuery({
    queryKey: ["operationSections"],
    queryFn: () => getOperationSections({ id, sectionType, questionRelName }),
  });

  if (operationSectionsPending) return null;

  return <DataContext.Provider value={{ operationSections, operationSectionsPending }}>{children}</DataContext.Provider>;
};

const useData = () => {
  const dataContext = useContext(DataContext);

  if (!dataContext) {
    throw new Error("useData must be used within a DataProvider");
  }

  return dataContext;
};

export { DataProvider, useData };
