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

export const getAssessmentQuestionTemplateByType = async (qtype: any) => {
  try {
    const qryCondition = `EA_SA_rsAssessmentQuestionType = ${qtype.EA_SA_rsAssessmentQuestionType} ORDER BY EA_SA_intDisplayOrder ASC`;

    //@ts-ignore
    return await _RB.selectQuery(templateFields, "EA_SA_AssessmentQuestionTemplate", qryCondition, 10000, true);
  } catch (error) {
    console.log("Error: getAssessmentQuestionTemplateByType ", error);
  }
};
