import { ReactElement } from "react";
import { Box } from "@mui/material";
import { Loading } from "./Loading";
import { useGlobal } from "../contexts/GlobalContext";
import QuestionTypeSection from "./QuestionTypeSection/QuestionTypeSection";
import { OpSecHeader } from "./OpSecHeader";
import NoQuestionTypes from "./NoQuestionTypes";
import { useData } from "../contexts/DataContext";
import { EditButtons } from "./EditButtons";

export const ImpactAssessment = (): ReactElement | null => {
  const { appParams, selectedOpsSection, setSelectedOpsSection } = useGlobal();
  const { operationSections, operationSectionsPending } = useData();

  if (operationSectionsPending) return <Loading boxStyles={{ marginY: 4 }} />;

  if (operationSections && operationSections.length === 0) return <NoQuestionTypes />;

  if (operationSections && operationSections.length > 0) {
    return (
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <EditButtons appParams={appParams} />
        <OpSecHeader operationSections={operationSections} selectedOpsSec={selectedOpsSection} setSelectedOpsSection={setSelectedOpsSection} mode={appParams.crudAction} />
        {operationSections.map((each, index) => {
          const questionTypeSectionProps = {
            appParams,
            currentOpsSectionInfo: each,
            displaySection: selectedOpsSection === index,
            operationSections,
            selectedOpsSection,
            setSelectedOpsSection,
          };

          return <QuestionTypeSection key={index} {...questionTypeSectionProps} />;
        })}
      </Box>
    );
  }

  return null;
};
