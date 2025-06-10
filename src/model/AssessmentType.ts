export const getAssessmentType = async ({ id, objectIntegrationName }) => {
  try {
    //@ts-ignore
    const assessmentName = await _RB.selectQuery(["id", "EA_SA_rsAssessment"], objectIntegrationName, `id = ${id}`, 1, true);

    //@ts-ignore
    const assessment = await _RB.selectQuery(["id", "EA_SA_rsAssessmentType"], "EA_SA_Assessment", `id = ${assessmentName[0].EA_SA_rsAssessment}`, 1, true);

    //@ts-ignore
    const assessmentType = await _RB.selectQuery(
      ["id", "name", "EA_SA_cbEnableAutofill", "EA_SA_cbEnableValidation"],
      "EA_SA_AssessmentType",
      `${id = assessment[0].EA_SA_rsAssessmentType}`,
      1,
      true
    );

    return assessmentType[0];
  } catch (error) {
    console.error("Error in getAssessmentQuestionTemplate: ", error);
  }
};
