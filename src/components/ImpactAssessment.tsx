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
import { useForm } from "react-hook-form";

export const ImpactAssessment = (): ReactElement | null => {
  const { appParams, selectedOpsSection, setSelectedOpsSection } = useGlobal();
  const { operationSections, operationSectionsPending } = useData();

  if (operationSectionsPending) return <Loading boxStyles={{ marginY: 4 }} />;

  if (operationSections && operationSections.length == 0) return <NoQuestionTypes />;

  if (operationSections && operationSections.length > 0) {
    return (
      <Box sx={{ width: "100%" }}>
        <EditButtons appParams={appParams} />
        <OpSecHeader operationSections={operationSections} selectedOpsSec={selectedOpsSection} setSelectedOpsSection={setSelectedOpsSection} />
        {operationSections.map((each, index) => {
          /** Each operation section has its own form.  */
          const {
            control,
            formState: { isValid },
          } = useForm({ mode: "onChange", reValidateMode: "onChange", resetOptions: { keepDirtyValues: true } });

          if (selectedOpsSection !== index) return null;

          return <QuestionTypeSection key={index} appParams={appParams} currentOpsSectionInfo={each} control={control} isValid={isValid} />;
        })}
        {/* <QuestionTypeSection appParams={appParams} control={control} currentOpsSectionInfo={operationSections[selectedOpsSection]} isValid={isValid} /> */}
        <BottomNavigation operationSections={operationSections} selectedOpsSection={selectedOpsSection} setSelectedOpsSection={setSelectedOpsSection} />
      </Box>
    );
  }

  return null;
};
