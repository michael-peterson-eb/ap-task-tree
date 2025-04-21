import { Box, useMediaQuery } from "@mui/material";
import { Loading } from "../Loading";
import QuestionTypeSectionHeader from "./QuestionTypeSectionHeader";
import { getAssessmentQuestionTemplateByType } from "../../model/mocked/assessmentQuestionTemplate";
import AssessmentQuestions from "../AssessmentQuestions";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import AssessmentProgressBox from "../AssessmentProgressBox";

const QuestionTypeSection = ({ appParams, currentOpsSectionInfo, displaySection, operationSections, selectedOpsSection, setSelectedOpsSection }) => {
  const { crudAction: mode, objectTitle } = appParams;
  const { id, name: questionName, status, EA_SA_rsAssessmentQuestionType } = currentOpsSectionInfo;
  const smallScreen: boolean = useMediaQuery("(max-width:640px)");

  const {
    control,
    formState: { isValid },
    trigger,
  } = useForm({ mode: "onChange", reValidateMode: "onChange", resetOptions: { keepDirtyValues: true } });

  const { isPending: questionTemplatePending, data: questionTemplate } = useQuery({
    queryKey: [`questionTemplateSections-${id}-${mode}`],
    queryFn: () => getAssessmentQuestionTemplateByType({ EA_SA_rsAssessmentQuestionType: EA_SA_rsAssessmentQuestionType }),
  });

  if (questionTemplatePending) return <Loading boxStyles={{ marginY: 4 }} />;

  if (!displaySection) return null;

  return (
    <Box sx={{ display: "flex", width: "100%", gap: "24px", flexDirection: smallScreen ? "column" : "row" }}>
      <Box sx={{ width: smallScreen ? "100%" : "60%" }}>
        <QuestionTypeSectionHeader mode={mode} status={status} objectTitle={objectTitle} questionName={questionName} />
        {questionTemplate.length > 0 &&
          questionTemplate.map((questionTemplateData) => {
            return (
              <AssessmentQuestions key={`assessment-questions-${questionTemplateData.id}`} appParams={appParams} control={control} questionTemplateData={questionTemplateData} />
            );
          })}
      </Box>
      <AssessmentProgressBox isValid={isValid} trigger={trigger} smallScreen={smallScreen} />
    </Box>
  );
};

export default QuestionTypeSection;
