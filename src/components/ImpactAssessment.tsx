import { ReactElement } from "react";
import { Box } from "@mui/material";
import { Loading } from "./Loading";
import { useGlobal } from "../contexts/GlobalContext";
import QuestionTypeSection from "./QuestionTypeSection/QuestionTypeSection";
import { OpSecHeader } from "./OpSecHeader";
import NoQuestionTypes from "./NoQuestionTypes";
import { useData } from "../contexts/DataContext";
import { EditButtons } from "./EditButtons";
import BottomNavigation from "./BottomNavigation";

export const ImpactAssessment = (): ReactElement | null => {
  const { appParams, selectedOpsSection, setSelectedOpsSection } = useGlobal();
  const { operationSections, operationSectionsPending } = useData();

  if (operationSectionsPending) return <Loading />;

  if (operationSections && operationSections.length == 0) return <NoQuestionTypes />;

  if (operationSections && operationSections.length > 0) {
    return (
      <Box sx={{ width: "100%" }}>
        <EditButtons appParams={appParams} />
        <OpSecHeader operationSections={operationSections} selectedOpsSec={selectedOpsSection} setSelectedOpsSection={setSelectedOpsSection} />
        <QuestionTypeSection appParams={appParams} currentOpsSectionInfo={operationSections[selectedOpsSection]} />
        <BottomNavigation operationSections={operationSections} selectedOpsSection={selectedOpsSection} setSelectedOpsSection={setSelectedOpsSection} />
      </Box>
    );
  }

  return null;
};
