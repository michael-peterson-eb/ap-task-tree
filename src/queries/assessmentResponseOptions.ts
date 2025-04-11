import { mockAssessmentQuestionResponse } from "../data/mockAssessmentQuestionResponse";

export const getResponseOptionsByTemplateId = async ({templateID}) => {
  try {
    if (process.env.NODE_ENV === "development") {
      const result = mockAssessmentQuestionResponse[templateID];

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(result);
        }, 500);
      });
    } else {
      const condition = `EA_SA_rsAssessmentQuestionTemplate=${templateID} ORDER BY EA_SA_intDisplayOrder ASC`;

      //@ts-ignore
      const results = await _RB.selectQuery(["id", "name", "EA_SA_txtAssmtRespOptCode"], "EA_SA_AssessmentResponseOption", condition, 10000, true);

      return results;
    }
  } catch (error) {
    console.log("Error: fetchAssessmentResponseOptions ", error);
  }
};
