export const getAssessmentType = async ({ id, objectIntegrationName }) => {
  try {
    let assessmentRelationName = "EA_SA_rsAssessment";

    if (objectIntegrationName === "EA_SA_Product_Service" || objectIntegrationName === "EA_SA_Application") {
      assessmentRelationName = "EA_SA_rsAssessments";
    }

    if (objectIntegrationName === "EA_RM_Risk") {
      assessmentRelationName = "EA_RM_rsAssessment";
    }

    if (objectIntegrationName === "EA_OR_ScenarioTest") {
      assessmentRelationName = "EA_OR_rsAssessment";
    }

    //@ts-ignore
    const assessmentName = await _RB.selectQuery(["id", assessmentRelationName], objectIntegrationName, `id = ${id}`, 1, true);

    console.log("assessmentName: ", assessmentName);

    const idParam = assessmentName[0][assessmentRelationName];

    //@ts-ignore
    const assessment = await _RB.selectQuery(["id", "EA_SA_rsAssessmentType"], "EA_SA_Assessment", `id = ${idParam}`, 1, true);

    console.log("assessment: ", assessment);

    //@ts-ignore
    const assessmentType = await _RB.selectQuery(
      ["id", "name", "EA_SA_cbEnableAutofill", "EA_SA_cbEnableValidation"],
      "EA_SA_AssessmentType",
      `${(id = assessment[0].EA_SA_rsAssessmentType)}`,
      1,
      true
    );

    return assessmentType[0];
  } catch (error) {
    console.error("Error in getAssessmentQuestionTemplate: ", error);
  }
};
