import { AnyARecord } from "dns";

export const fetchAssessmentResponseOptions = async (templateID: any) => {
  try {
    const condition = `EA_SA_rsAssessmentQuestionTemplate=${templateID} ORDER BY EA_SA_intDisplayOrder ASC`;

    const results = await _RB.selectQuery(
      ["id", "name"],
      "EA_SA_AssessmentResponseOption",
      condition,
      10000,
      true
    );
    return results;
  } catch (error) {
    console.log("Error: fetchAssessmentResponseOptions ", error);
  }
};

export const getRelatedResponseOptions = async (questionID: any) => {
  try {
    // Response Options Relationship Integration Name: R7996162
    const results = await _RB.getRelatedFields(
      "R7996162",
      ",EA_SA_AssessmentQuestion",
      questionID,
      "id"
    );
    return results;
  } catch (error) {
    console.log("Error: getRelatedResponseOptions ", error);
  }
};
