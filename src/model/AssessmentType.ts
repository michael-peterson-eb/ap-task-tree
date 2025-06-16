const objIntRelLookupMap = {
  EA_SA_Process: "EA_SA_rsAssessment",
  EA_SA_Product_Service: "EA_SA_rsAssessments",
  EA_SA_Application: "EA_SA_rsAssessments",
  EA_RM_Risk: "EA_RM_rsAssessment",
  EA_RM_Risk_Assessment: "EA_RM_rsAssessment",
  EA_SA_Assessment: "EA_SA_rsAssessment",
  EA_EI_Activation: "EA_EI_rsAssessment",
  EA_OR_ScenarioTest: "EA_OR_rsAssessment",
};

const noAssessmentLookup = () => {
  return {
    EA_SA_cbEnableAutofill: false,
    EA_SA_cbEnableValidation: false,
  };
};

export const getAssessmentType = async ({ id, objectIntegrationName }) => {
  try {
    const relationName = objIntRelLookupMap[objectIntegrationName];

    if (!relationName) {
      console.error(`Unsupported objectIntegrationName: ${objectIntegrationName}`);
      return noAssessmentLookup();
    }

    let assessmentId: number;

    if (objectIntegrationName === "EA_SA_Assessment") {
      //@ts-ignore
      const [assessment] = await _RB.selectQuery(["id", "EA_SA_rsAssessmentType"], "EA_SA_Assessment", `id = ${id}`, 1, true);
      assessmentId = assessment?.EA_SA_rsAssessmentType;
    } else {
      //@ts-ignore
      const [record] = await _RB.selectQuery(["id", relationName], objectIntegrationName, `id = ${id}`, 1, true);

      const linkedAssessmentId = record?.[relationName];
      if (!linkedAssessmentId) {
        console.error(`No linked assessment found for ${objectIntegrationName} with ID ${id}`);
        return noAssessmentLookup();
      }

      //@ts-ignore
      const [assessment] = await _RB.selectQuery(["id", "EA_SA_rsAssessmentType"], "EA_SA_Assessment", `id = ${linkedAssessmentId}`, 1, true);

      assessmentId = assessment?.EA_SA_rsAssessmentType;
    }

    if (!assessmentId) {
      console.error(`No assessment type found for ${objectIntegrationName} with ID ${id}`);
      return noAssessmentLookup();
    }

    //@ts-ignore
    const [assessmentType] = await _RB.selectQuery(["id", "name", "EA_SA_cbEnableAutofill", "EA_SA_cbEnableValidation"], "EA_SA_AssessmentType", `id = ${assessmentId}`, 1, true);

    console.log(`Assessment Type: ${assessmentType.name} for ${objectIntegrationName}`);

    return (
      assessmentType || {
        id: assessmentType.id,
        name: assessmentType.name,
        EA_SA_cbEnableAutofill: false,
        EA_SA_cbEnableValidation: false,
      }
    );
  } catch (error) {
    console.error("Error in getAssessmentType:", error);
    return noAssessmentLookup();
  }
};
