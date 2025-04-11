export const formatOperationSections = (data) => {
  return data.map((each) => {
    return {
      id: each[0],
      name: each[1],
      status: each[2],
      EA_SA_txtCode: each[3],
      EA_SA_rsAssessmentQuestionType: each[4],
      EA_SA_rsAssessmentQuestions: each[5],
    };
  });
};

export const formatAssessmentQuestionTemplate = data => {
    return data.map((each) => {
        return {
            id: each[0],
            EA_SA_ddlResponseFormat: each[1],
            EA_SA_cbIncludeFileUpload: each[2],
            EA_SA_txtaHelpText: each[3],
            EA_SA_txtaQuestion: each[4],
            EA_SA_intDisplayOrder: each[5],
            EA_SA_cbAskPerTimeInterval: each[6],
            EA_SA_cbRequiredQuestion: each[7],
            EA_SA_intQuestionWeighting: each[8],
            EA_SA_ddlAskPer: each[9],
            EA_SA_txtFieldIntegrationName: each[10]
        };
    });
}
