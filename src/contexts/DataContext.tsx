import { createContext, useContext, useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOperationSections } from "../model/mocked/operationSection";
import { Loading } from "../components/Loading";

const DataContext = createContext({
  operationSections: [],
  operationSectionsPending: false,
  opSecUpdates: { current: {} },
  opSecStatuses: [],
  questionUpdates: { current: {} },
  refetchOpSecs: () => {},
  riskUpdates: { current: {} },
  setOpSecStatuses: (value) => {},
});

const DataProvider = ({ children, appParams }) => {
  const { id, sectionType, questionRelName, crudAction: mode } = appParams;

  const opSecUpdates = useRef({});
  const questionUpdates = useRef({});
  const riskUpdates = useRef({});

  const {
    isPending: operationSectionsPending,
    data: operationSections,
    refetch: refetchOpSecs,
  } = useQuery({
    queryKey: [`operationSections-${id}-${mode}`, mode],
    queryFn: () => getOperationSections({ id, sectionType, questionRelName }),
  });

  const [opSecStatuses, setOpSecStatuses] = useState([]);

  useEffect(() => {
    if (operationSections) {
      const opSecStatuses = operationSections.map((operationSection) => {
        const { status } = operationSection;
        if (status === "completed") {
          return true;
        } else {
          return false;
        }
      });
      setOpSecStatuses(opSecStatuses);
    }
  }, [operationSections]);

  if (operationSectionsPending || !operationSections) return <Loading />;

  return (
    <DataContext.Provider value={{ operationSections, operationSectionsPending, opSecUpdates, opSecStatuses, questionUpdates, refetchOpSecs, riskUpdates, setOpSecStatuses }}>
      {children}
    </DataContext.Provider>
  );
};

const useData = () => {
  const dataContext = useContext(DataContext);

  if (!dataContext) {
    throw new Error("useData must be used within a DataProvider");
  }

  return dataContext;
};

export { DataProvider, useData };
