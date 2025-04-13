import { createContext, useContext, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOperationSections } from "../model/mocked/operationSection";
import { Loading } from "../components/Loading";

const DataContext = createContext({
  operationSections: [],
  operationSectionsPending: false,
  refetchOpSecs: () => {},
  opSecUpdates: { current: {} },
  questionUpdates: { current: {} },
  riskUpdates: { current: {} },
});

const DataProvider = ({ children, appParams }) => {
  const { id, sectionType, questionRelName, crudAction: mode } = appParams;

  const opSecUpdates = useRef({});
  const questionUpdates = useRef({});
  const riskUpdates = useRef({});

  const {
    isPending: operationSectionsPending,
    error,
    data: operationSections,
    refetch: refetchOpSecs,
  } = useQuery({
    queryKey: [`operationSections-${id}-${mode}`],
    queryFn: () => getOperationSections({ id, sectionType, questionRelName }),
  });

  if (operationSectionsPending || !operationSections) return <Loading />;

  return <DataContext.Provider value={{ operationSections, operationSectionsPending, refetchOpSecs, opSecUpdates, questionUpdates, riskUpdates }}>{children}</DataContext.Provider>;
};

const useData = () => {
  const dataContext = useContext(DataContext);

  if (!dataContext) {
    throw new Error("useData must be used within a DataProvider");
  }

  return dataContext;
};

export { DataProvider, useData };
