export const fetchQuestionsIntervals = async (templateID: any) => {
  try {
    // EA_SA_rsProcess=${RECORD_INFO.id} AND
    const condition = `${ASSESSMENT_QUESTION_CONDITION} AND EA_SA_rsAssessmentQuestionTemplate=${templateID} AND EA_SA_rsTimeInterval<>'null' ORDER BY EA_SA_rfTimeInSeconds ASC`;
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
      condition,
      10000,
      true
    );

    return await results;
  } catch (error) {
    console.log("Error: fetchQuestions ", error);
  }
};
