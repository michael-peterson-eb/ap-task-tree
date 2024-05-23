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
];

export const getAssessmentQuestionTemplateByIds = async (ids: any) => {
  try {
    const qryCondition = `id IN (${ids}) ORDER BY EA_SA_intDisplayOrder ASC`;

    const results = await _RB.selectQuery(templateFields, "EA_SA_AssessmentQuestionTemplate", qryCondition, 10000, true);
    return results;
  } catch (error) {
    console.log("Error: fetchAssessmentQuestionTemplate ", error);
  }
};

export const getAssessmentQuestionTemplateByType = async (qtype: any) => {
  try {
    const qryCondition = `EA_SA_rsAssessmentQuestionType = ${qtype.EA_SA_rsAssessmentQuestionType} ORDER BY EA_SA_intDisplayOrder ASC`;
    console.log("--getAssessmentQuestionTemplateByType--", qryCondition, qtype);
    return await _RB.selectQuery(templateFields, "EA_SA_AssessmentQuestionTemplate", qryCondition, 10000, true);

  } catch (error) {
    console.log("Error: getAssessmentQuestionTemplateByType ", error);
  }
};

export const getAssessmentQuestionByIds = async (ids: any) => {
  try {
    const qryCondition = `id IN (${ids}) ORDER BY EA_SA_intDisplayOrder ASC`;
    const results = await _RB.selectQuery(templateFields, "EA_SA_AssessmentQuestionTemplate", qryCondition, 10000, true);
    return results;

  } catch (error) {
    console.log("Error: fetchAssessmentQuestionTemplate ", error);
  }
};

export const getAssessmentQuestionByType = async (recordInfo:any, qtype: any) => {
  try {
    const assmtObjRel = recordInfo.questionRelName;

    const qryCondition = `${assmtObjRel}=${recordInfo.id} && EA_SA_rsOperationsSections = ${qtype.id} ORDER BY EA_SA_intDisplayOrder ASC`;

    //console.log("--getAssessmentQuestionByType--", qryCondition, qtype);
    return await _RB.selectQuery(templateFields, "EA_SA_AssessmentQuestion", qryCondition, 10000, true);

  } catch (error) {
    console.log("Error: getAssessmentQuestionTemplateByType ", error);
  }
};
