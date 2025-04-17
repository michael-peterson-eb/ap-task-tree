import { Box } from "@mui/material";
import { Loading } from "../Loading";
import QuestionTypeSectionHeader from "./QuestionTypeSectionHeader";
import { getAssessmentQuestionTemplateByType } from "../../model/mocked/assessmentQuestionTemplate";
import AssessmentQuestions from "../AssessmentQuestions";
import { useQuery } from "@tanstack/react-query";
import { EditAlert } from "../EditAlert";
import { useForm } from "react-hook-form";

const QuestionTypeSection = ({ appParams, currentOpsSectionInfo, displaySection }) => {
  const { crudAction: mode, objectTitle } = appParams;
  const { id, name: questionName, status, EA_SA_rsAssessmentQuestionType } = currentOpsSectionInfo;

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
    <>
      <QuestionTypeSectionHeader mode={mode} status={status} objectTitle={objectTitle} questionName={questionName} />
      <Box sx={{ margin: "auto", overflow: "auto" }}>
        {questionTemplate.length > 0 &&
          questionTemplate.map((questionTemplateData) => {
            return (
              <AssessmentQuestions key={`assessment-questions-${questionTemplateData.id}`} appParams={appParams} control={control} questionTemplateData={questionTemplateData} />
            );
          })}
        <EditAlert isValid={isValid} trigger={trigger} />
      </Box>
    </>
  );
};

export default QuestionTypeSection;
