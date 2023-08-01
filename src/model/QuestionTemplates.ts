const templateFields = [
  "id",
  "EA_SA_ddlResponseFormat#code",
  "EA_SA_cbIncludeFileUpload",
  "EA_SA_txtaQuestion",
  "EA_SA_txtaHelpText",
  "EA_SA_intDisplayOrder",
  "EA_SA_cbAskPerTimeInterval",
  "EA_SA_cbRequiredQuestion",
  "EA_SA_cbIncludeFileUpload",
  "EA_SA_intQuestionWeighting",
];

export const getAssessmentQuestionTemplateByIds = async (ids: any) => {
  try {
    const qryCondition = `id IN (${ids}) ORDER BY EA_SA_intDisplayOrder ASC`;

    const results = await _RB.selectQuery(
      templateFields,
      "EA_SA_AssessmentQuestionTemplate",
      qryCondition,
      10000,
      true
    );
    return results;
  } catch (error) {
    console.log("Error: fetchAssessmentQuestionTemplate ", error);
  }
};

export const getAssessmentQuestionTemplateByType = async (qtype) => {
  //console.log("--getAssessmentQuestionTemplateByType--", qtype);
  const qryCondition = `EA_SA_rsAssessmentQuestionType = ${qtype.id} ORDER BY EA_SA_intDisplayOrder ASC`;

  return await _RB.selectQuery(
    templateFields,
    "EA_SA_AssessmentQuestionTemplate",
    qryCondition,
    10000,
    true
  );
};
