const AssessmentQuestionFields = [
  "id",
  "name",
  "EA_SA_rfQuestionType",
  "EA_SA_txtaResponse",
  "EA_SA_ddResponse",
  "EA_SA_curResponse",
  "EA_SA_txtaAdditionalInformation",
  "EA_SA_rsTimeInterval",
  "EA_SA_rsAssessmentResponseOptions",
  "EA_SA_rsAssessmentQuestionTemplate",
  "EA_SA_rfTimeInterval",
];

/**
 * fetch Assessment Questions by record id and question type id
 * @param questionTypeID
 * @returns
 */
export const fetchQuestionsByQuestionTypeId = async (
  questionTypeId: any,
  recordInfo: any
) => {
  try {
    let queryCondition = `${recordInfo.questionRelName}=${recordInfo.id}`;
    queryCondition += ` AND EA_SA_rfQuestionType=${questionTypeId}`;
    queryCondition += ` AND EA_SA_rsAssessmentQuestionTemplate <> 'null'`;

    const fields = [
      "id",
      "name",
      "EA_SA_rfQuestionType",
      "EA_SA_txtaResponse",
      "EA_SA_ddResponse",
      "EA_SA_curResponse",
      "EA_SA_txtaAdditionalInformation",
      "EA_SA_rsTimeInterval",
      "EA_SA_rsAssessmentResponseOptions",
      "EA_SA_rsAssessmentQuestionTemplate",
    ];

    const results = await _RB.selectQuery(
      fields,
      "EA_SA_AssessmentQuestion",
      queryCondition,
      10000,
      true
    );
    return results;
  } catch (error) {
    console.log("Error: fetchQuestions ", error);
  }
};

export const fetchAssessQuestionsByTemplateId = async (
  recordInfo: any,
  templateID: any
) => {
  try {
    // EA_SA_rsProcess=${RECORD_INFO.id} AND
    let queryCondition = `${recordInfo.questionRelName}=${recordInfo.id}`;
    queryCondition += ` AND EA_SA_rsAssessmentQuestionTemplate=${templateID}`;
    queryCondition += ` AND EA_SA_rsAssessmentQuestionTemplate <> 'null'`;

    const results = await _RB.selectQuery(
      AssessmentQuestionFields,
      "EA_SA_AssessmentQuestion",
      queryCondition,
      100,
      true
    );

    return await results;
  } catch (error) {
    console.log(
      "Error: QuestionInterval:fetchQuestionsIntervalsByTemplateId ",
      error
    );
  }
};

/**
 * fetch Assessment Question by record Id and Template Id and TimeInterval
 * @param recordInfo
 * @param templateID
 * @returns
 */
export const fetchQuestionsIntervalsByTemplateId = async (
  recordInfo: any,
  templateID: any
) => {
  try {
    // EA_SA_rsProcess=${RECORD_INFO.id} AND
    let queryCondition = `${recordInfo.questionRelName}=${recordInfo.id}`;
    queryCondition += ` AND EA_SA_rsAssessmentQuestionTemplate=${templateID}`;
    queryCondition += ` AND EA_SA_rsTimeInterval <> 'null' ORDER BY EA_SA_rfTimeInSeconds ASC`;

    const fields = [
      "id",
      "name",
      "EA_SA_rfQuestionType",
      "EA_SA_txtaResponse",
      "EA_SA_ddResponse",
      "EA_SA_curResponse",
      "EA_SA_txtaAdditionalInformation",
      "EA_SA_rsTimeInterval",
      "EA_SA_rsAssessmentResponseOptions",
      "EA_SA_rsAssessmentQuestionTemplate",
      "EA_SA_rfTimeInterval",
    ];

    const results = await _RB.selectQuery(
      fields,
      "EA_SA_AssessmentQuestion",
      queryCondition,
      10000,
      true
    );

    return await results;
  } catch (error) {
    console.log(
      "Error: QuestionInterval:fetchQuestionsIntervalsByTemplateId ",
      error
    );
  }
};

/**
 * fetchAssessmentQuestionTypes
 * @param assessmentQuestionCondition
 * @returns
 */
export const fetchTypesOfAssessmentQuestion = async (
  assessmentQuestionCondition: any
) => {
  try {
    const condition = `${assessmentQuestionCondition} AND EA_SA_rfQuestionType <> 'null' GROUP BY EA_SA_rfQuestionType ORDER BY EA_SA_rfQuestionType`;

    const results = await _RB.selectQuery(
      ["EA_SA_rfQuestionType"],
      "EA_SA_AssessmentQuestion",
      condition,
      10000,
      true
    );
    return results;
  } catch (error) {
    console.log("Error: fetchTypesOfAssessmentQuestion ", error);
  }
};

/**
 * fetchAssessmentQuestionType
 * @param id
 * @returns
 */
export const xfetchAssessmentQuestionType = async (id: any) => {
  try {
    const condition = `id=${id}`;
    const results = await _RB.selectQuery(
      ["name"],
      "EA_SA_AssessmentQuestionType",
      condition,
      1,
      true
    );
    return results;
  } catch (error) {
    console.log("Error: fetchAssessmentQuestionType ", error);
  }
};

/**
 * update individual Assessment Question record
 * @param recordID
 * @param fields
 * @returns
 */
export const updateQuestion = async (recordID: any, fields: any) => {
  try {
    const results = await _RB.updateRecord(
      "EA_SA_AssessmentQuestion",
      recordID,
      fields
    );
    return results;
  } catch (error) {
    console.log("Error: updateQuestion ", error);
  }
};

const concatObjectIds = (values: any) => {
  const ids = values.map((opt: any) => {
    return opt.id;
  });
  return ids.join(",");
};

export const updateQuestionWithResponse = async (
  updatedResponses: any,
  responseFields: any
) => {
  for (let recordId in updatedResponses) {
    const record = updatedResponses[recordId];
    const fields = {};
    const recordType = record.type;
    if (responseFields.hasOwnProperty(recordType)) {
      let value = record.value;
      if (recordType === "MSP") value = concatObjectIds(value);
      console.log("--updateValue--", value, recordType);
      fields[responseFields[recordType]] = value;
      await updateQuestion(recordId, fields);
    }
  }
};

export const getRelatedResponseOptions = async (questionId: any) => {
  try {
    // R7996162=Assessment Question to Assessment Response Options
    const results = await _RB.getRelatedFields(
      "R7996162",
      ",EA_SA_AssessmentQuestion",
      questionId,
      "id"
    );
    return results;
  } catch (error) {
    console.log("Error: getRelatedResponseOptions ", error);
  }
};
