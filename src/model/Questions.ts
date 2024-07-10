const AssessmentQuestionFields = [
  "id",
  "name",
  "EA_SA_ddlAskPer#code",
  "EA_SA_rfQuestionType",
  "EA_SA_txtaResponse",
  "EA_SA_txtaQuestion",
  "EA_SA_ddResponse",
  "EA_SA_curResponse",
  "EA_SA_intResponse",
  "EA_SA_decResponse",
  "EA_SA_txtaAdditionalInformation",
  "EA_SA_rsTimeInterval",
  "EA_SA_rsAssessmentResponseOptions",
  "EA_SA_rsAssessmentQuestionTemplate",
  "EA_SA_rfTimeInterval",
  "EA_SA_rfQuestion",
  "EA_SA_rfRequiredQuestion",
  "EA_SA_cbRequiredQuestion",
  "EA_SA_rfOperationSectionType",
  "EA_OR_txtaResponse",
  "EA_OR_rsSeverityLevel",
  "EA_OR_mddlPeriodsInScope#code",
  "EA_OR_txtSeverityLevelName",
  "EA_OR_curResponse",
  "EA_OR_decResponse",
  "EA_OR_intResponse",
  "EA_OR_ddResponse",
];
/**
 * fetch Assessment Questions by record id and question type id
 * @param questionTypeID
 * @returns
 */
export const fetchQuestionsByQuestionTypeId = async (questionTypeId: any, recordInfo: any) => {
  try {
    let queryCondition = "";

    queryCondition += `${recordInfo.questionRelName}=${recordInfo.id}`;
    queryCondition += ` AND EA_SA_rfOperationSectionType='${recordInfo.sectionType}'`;
    queryCondition += ` AND EA_SA_rfQuestionType=${questionTypeId}`;
    queryCondition += ` AND EA_SA_rsAssessmentQuestionTemplate <> 'null'`;

    const results = await _RB.selectQuery(AssessmentQuestionFields, "EA_SA_AssessmentQuestion", queryCondition, 10000, true);
    return results;
  } catch (error) {
    console.log("Error: fetchQuestions ", error);
  }
};

export const fetchAssessQuestionsByTemplateId = async (recordInfo: any, templateID: any) => {
  try {
    let queryCondition = "";

    queryCondition += `${recordInfo.questionRelName}=${recordInfo.id}`;
    queryCondition += ` AND EA_SA_rfOperationSectionType='${recordInfo.sectionType}'`;
    queryCondition += ` AND EA_SA_rsAssessmentQuestionTemplate=${templateID}`;
    queryCondition += ` AND EA_SA_rsAssessmentQuestionTemplate <> 'null'`;

    const results = await _RB.selectQuery(AssessmentQuestionFields, "EA_SA_AssessmentQuestion", queryCondition, 1, true);
    //console.log("fetchAssessQuestionsByTemplateId--", results);

    return await results;
  } catch (error) {
    console.log("Error: fetchAssessQuestionsByTemplateId ", error);
  }
};

/**
 * fetch Assessment Question by record Id and Template Id and TimeInterval
 * @param recordInfo
 * @param templateID
 * @returns
 */
export const fetchQuestionsIntervalsByTemplateId = async (recordInfo: any, templateID: any) => {
  try {
    let queryCondition = "";

    queryCondition += `${recordInfo.questionRelName}=${recordInfo.id}`;
    queryCondition += ` AND EA_SA_rfOperationSectionType='${recordInfo.sectionType}'`;
    queryCondition += ` AND EA_SA_rsAssessmentQuestionTemplate=${templateID}`;
    queryCondition += ` AND EA_SA_rsTimeInterval <> 'null' ORDER BY EA_SA_rfTimeInSeconds ASC`;

    const results = await _RB.selectQuery(AssessmentQuestionFields, "EA_SA_AssessmentQuestion", queryCondition, 10000, true);

    return await results;
  } catch (error) {
    console.log("Error: fetchQuestionsIntervalsByTemplateId ", error);
  }
};

/**
 * fetch Assessment Question by record Id and Template Id and Severity Level
 * @param recordInfo
 * @param templateID
 * @returns
 */
export const fetchQuestionsSeverityByTemplateId = async (recordInfo: any, templateID: any) => {
  try {
    let queryCondition = "";

    queryCondition += `${recordInfo.questionRelName}=${recordInfo.id}`;
    queryCondition += ` AND EA_SA_rfOperationSectionType='${recordInfo.sectionType}'`;
    queryCondition += ` AND EA_SA_rsAssessmentQuestionTemplate=${templateID}`;
    queryCondition += ` AND EA_OR_rsSeverityLevel <> 'null'`;

    //console.log("--fetchQuestionsSeverityByTemplateId--", queryCondition);
    const results = await _RB.selectQuery(AssessmentQuestionFields, "EA_SA_AssessmentQuestion", queryCondition, 10000, true);

    return await results;
  } catch (error) {
    console.log("Error: fetchQuestionsSeverityByTemplateId ", error);
  }
};

/**
 * fetchAssessmentQuestionTypes
 * @param assessmentQuestionCondition
 * @returns
 */
export const fetchTypesOfAssessmentQuestion = async (assessmentQuestionCondition: any) => {
  try {
    const condition = `${assessmentQuestionCondition} AND EA_SA_rfQuestionType <> 'null' GROUP BY EA_SA_rfQuestionType ORDER BY EA_SA_rfQuestionType`;

    const results = await _RB.selectQuery(["EA_SA_rfQuestionType"], "EA_SA_AssessmentQuestion", condition, 10000, true);
    return results;
  } catch (error) {
    console.log("Error: fetchTypesOfAssessmentQuestion ", error);
  }
};

/**
 * update individual Assessment Question record
 * @param recordID
 * @param fields
 * @returns
 */
export const updateQuestion = async (recordId: any, fields: any) => {
  try {
    //console.log("--updateQuestion--", recordId, fields);
    const results = await _RB.updateRecord("EA_SA_AssessmentQuestion", recordId, fields);
    return results;
  } catch (error) {
    console.log("Error: updateQuestion ", error);
  }
};

export const concatObjectIds = (values: any) => {
  const ids = values.map((opt: any) => {
    return opt.id;
  });
  return ids.join(",");
};

export const updateQuestionWithResponse = async (updatedResponses: any, defaultFields: any, peakFields: any) => {
  for (let recordId in updatedResponses) {
    const record = updatedResponses[recordId];
    const recordType: any = record.type;

    if (defaultFields.hasOwnProperty(recordType)) {
      //console.log("--updateQuestionWithResponse:2--", record.fieldValue);
      await updateQuestion(recordId, record.fieldValue);
    }
  }
};

export const getRelatedResponseOptions = async (questionId: any) => {
  try {
    // R7996162=Assessment Question to Assessment Response Options
    const results = await _RB.getRelatedFields("R7996162", ",EA_SA_AssessmentQuestion", questionId, "id");
    return results;
  } catch (error) {
    console.log("Error: getRelatedResponseOptions ", error);
  }
};

export const getAssessmentQuestion = async (recordInfo: any, templateId: any, preloadedAQ: any) => {
  let assessQuestions = preloadedAQ;

  // check if Assessment Question data is NOT preloaded
  if (preloadedAQ == undefined) {
    assessQuestions = await fetchAssessQuestionsByTemplateId(recordInfo, templateId);
  }

  return assessQuestions;
};
