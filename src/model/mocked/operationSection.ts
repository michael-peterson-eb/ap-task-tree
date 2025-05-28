import { mockOperationSections } from "../../data/mockOperationSection";
import { formatOperationSections } from "../../utils/format";

export const getOperationSections = async ({ id, sectionType, questionRelName }) => {
  try {
    if (process.env.NODE_ENV === "development") {
      const formatted = formatOperationSections(mockOperationSections);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(formatted);
        }, 500);
      });
    } else {
      let queryCondition = `${questionRelName}=${id}`;
      queryCondition = queryCondition + ` AND EA_SA_ddlSectionType#code='${sectionType}'`;
      queryCondition = queryCondition + ` AND EA_SA_cbDisplaySection=1`;

      //@ts-ignore
      const results = await _RB.selectQuery(
        ["id", "name", "status#code", "EA_SA_txtCode", "EA_SA_rsAssessmentQuestionType", "EA_SA_rsAssessmentQuestions", "EA_SA_txtaAdditionalInformation"],
        "EA_SA_OperationsSection",
        queryCondition,
        100,
        true
      );

      return results.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    }
  } catch (error) {
    console.error("Error in getOperationSections: ", error);
  }
};
