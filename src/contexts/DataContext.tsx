import { createContext, useContext, useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOperationSections } from "../model/mocked/operationSection";
import { Loading } from "../components/Loading";
import { getAssessmentType } from "../model/AssessmentType";

const DataContext = createContext({
  assessmentType: {
    id: "",
    name: "",
    EA_SA_cbEnableAutofill: false,
    EA_SA_cbEnableValidation: false,
  },
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
  const { id, sectionType, objectIntegrationName, questionRelName, crudAction: mode } = appParams;

  const { isPending: assessmentTypePending, data: assessmentType } = useQuery({
    queryKey: ["assessment-type", id, objectIntegrationName],
    queryFn: () => getAssessmentType({ id, objectIntegrationName }),
  });

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

  if (operationSectionsPending || !operationSections || assessmentTypePending || !assessmentType) return <Loading />;

  return (
    <DataContext.Provider
      value={{ assessmentType, operationSections, operationSectionsPending, opSecUpdates, opSecStatuses, questionUpdates, refetchOpSecs, riskUpdates, setOpSecStatuses }}
    >
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
