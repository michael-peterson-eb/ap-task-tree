import { mockAssessmentQuestionTemplate } from "../data/mockAssessmentQuestionTemplate";
import { formatAssessmentQuestionTemplate } from "../utils/format";

const templateFields = [
  "id",
  "EA_SA_ddlResponseFormat#code",
  "EA_SA_cbIncludeFileUpload",
  "EA_SA_txtaHelpText",
  "EA_SA_txtaQuestion",
  "EA_SA_intDisplayOrder",
  "EA_SA_cbAskPerTimeInterval",
  "EA_SA_cbRequiredQuestion",
  "EA_SA_intQuestionWeighting",
  "EA_SA_ddlAskPer#code",
  "EA_SA_txtFieldIntegrationName",
];

export const getAssessmentQuestionTemplateByType = async ({ EA_SA_rsAssessmentQuestionType }) => {
  try {
    if (process.env.NODE_ENV === "development") {
      const assessmentQuestions = mockAssessmentQuestionTemplate[EA_SA_rsAssessmentQuestionType];

      const formatted = formatAssessmentQuestionTemplate(assessmentQuestions);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(formatted);
        }, 500);
      });
    } else {
      const qryCondition = `EA_SA_rsAssessmentQuestionType = ${EA_SA_rsAssessmentQuestionType} ORDER BY EA_SA_intDisplayOrder ASC`;

      //@ts-ignore
      const results = await _RB.selectQuery(templateFields, "EA_SA_AssessmentQuestionTemplate", qryCondition, 10000, true);

      return results;
    }
  } catch (error) {
    console.error("Error in getAssessmentQuestionTemplate: ", error);
  }
};
