const objIntRelLookupMap = {
  EA_SA_Process: "EA_SA_rsAssessment",
  EA_SA_Product_Service: "EA_SA_rsAssessments",
  EA_SA_Application: "EA_SA_rsAssessments",
  EA_RM_Risk: "EA_RM_rsAssessment",
  EA_RM_Risk_Assessment: "EA_RM_rsAssessment",
  EA_SA_Assessment: "EA_SA_rsAssessment",
  EA_EI_Activation: "EA_EI_rsAssessment",
};

export const getAssessmentType = async ({ id, objectIntegrationName }) => {
  try {
    const relationName = objIntRelLookupMap[objectIntegrationName];
    if (!relationName) throw new Error(`Unsupported objectIntegrationName: ${objectIntegrationName}`);

    let assessmentId: number;

    if (objectIntegrationName === "EA_SA_Assessment") {
      //@ts-ignore
      const [assessment] = await _RB.selectQuery(["id", "EA_SA_rsAssessmentType"], "EA_SA_Assessment", `id = ${id}`, 1, true);
      assessmentId = assessment?.EA_SA_rsAssessmentType;
    } else {
      //@ts-ignore
      const [record] = await _RB.selectQuery(["id", relationName], objectIntegrationName, `id = ${id}`, 1, true);

      const linkedAssessmentId = record?.[relationName];
      if (!linkedAssessmentId) throw new Error(`Missing relation ID in ${relationName}`);

      //@ts-ignore
      const [assessment] = await _RB.selectQuery(["id", "EA_SA_rsAssessmentType"], "EA_SA_Assessment", `id = ${linkedAssessmentId}`, 1, true);

      assessmentId = assessment?.EA_SA_rsAssessmentType;
    }

    if (!assessmentId) throw new Error("Missing assessment type ID");

    //@ts-ignore
    const [assessmentType] = await _RB.selectQuery(["id", "name", "EA_SA_cbEnableAutofill", "EA_SA_cbEnableValidation"], "EA_SA_AssessmentType", `id = ${assessmentId}`, 1, true);

    return (
      assessmentType || {
        id: 0,
        name: "Unknown",
        EA_SA_cbEnableAutofill: false,
        EA_SA_cbEnableValidation: false,
      }
    );
  } catch (error) {
    console.error("Error in getAssessmentType:", error);
    return {
      id: 0,
      name: "Error",
      EA_SA_cbEnableAutofill: false,
      EA_SA_cbEnableValidation: false,
    };
  }
};
