/**
 * fetchQuestions
 * @param questionTypeID
 * @returns
 */
export const fetchQuestions = async (questionTypeID: any) => {
  try {
    const condition = `${RECORD_INFO.questionRelName}=${RECORD_INFO.id} AND EA_SA_rfQuestionType=${questionTypeID} AND EA_SA_rsAssessmentQuestionTemplate<>'null'`;
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
      condition,
      10000,
      true
    );
    return results;
  } catch (error) {
    console.log("Error: fetchQuestions ", error);
  }
};

/**
 * fetchAssessmentQuestionTypes
 * @param assessmentQuestionCondition
 * @returns
 */
export const fetchAssessmentQuestionTypes = async (
  assessmentQuestionCondition: any
) => {
  try {
    const condition = `${assessmentQuestionCondition} AND EA_SA_rfQuestionType<>'null' GROUP BY EA_SA_rfQuestionType ORDER BY EA_SA_rfQuestionType`;

    const results = await _RB.selectQuery(
      ["EA_SA_rfQuestionType"],
      "EA_SA_AssessmentQuestion",
      condition,
      10000,
      true
    );
    return results;
  } catch (error) {
    console.log("Error: fetchAssessmentQuestionTypes ", error);
  }
};

/**
 * fetchAssessmentQuestionType
 * @param id
 * @returns
 */
export const fetchAssessmentQuestionType = async (id: any) => {
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
 * updateQuestion
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
