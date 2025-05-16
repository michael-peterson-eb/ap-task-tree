export const fetchResponseOptionsByTemplateId = async (templateID: any) => {
  try {
    const condition = `EA_SA_rsAssessmentQuestionTemplate=${templateID} ORDER BY EA_SA_intDisplayOrder ASC`;

    //@ts-ignore
    const results = await _RB.selectQuery(["id", "name", "EA_SA_txtAssmtRespOptCode", "EA_SA_txtLabelColor"], "EA_SA_AssessmentResponseOption", condition, 10000, true);

    return results;
  } catch (error) {
    console.log("Error: fetchAssessmentResponseOptions ", error);
  }
};
