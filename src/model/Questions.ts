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
  "EA_SA_txtAdditionalInformation",
  "EA_SA_rsTimeInterval",
  "EA_SA_rsAssessmentResponseOptions",
  "EA_SA_rsAssessmentQuestionTemplate",
  "EA_SA_rfTimeInterval",
  "EA_SA_txtTimeIntervalName",
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
  "EA_SA_rsPeakAssessmentResponseOptions",
];

export const fetchAssessQuestionsByTemplateId = async (recordInfo: any, templateID: any) => {
  try {
    let queryCondition = "";

    queryCondition += `${recordInfo.questionRelName}=${recordInfo.id}`;
    queryCondition += ` AND EA_SA_rfOperationSectionType='${recordInfo.sectionType}'`;
    queryCondition += ` AND EA_SA_rsAssessmentQuestionTemplate=${templateID}`;
    queryCondition += ` AND EA_SA_rsAssessmentQuestionTemplate <> 'null'`;
    queryCondition += ` AND EA_SA_cbDisplayQuestion=true`;

    //@ts-ignore
    const results = await _RB.selectQuery(AssessmentQuestionFields, "EA_SA_AssessmentQuestion", queryCondition, 1, true);

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
    queryCondition += ` AND EA_SA_cbDisplayQuestion=true`;
    queryCondition += ` AND EA_SA_rsTimeInterval <> 'null' ORDER BY EA_SA_rfTimeInSeconds ASC`;

    //@ts-ignore
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
    queryCondition += ` AND EA_SA_cbDisplayQuestion=true`;

    //@ts-ignore
    const results = await _RB.selectQuery(AssessmentQuestionFields, "EA_SA_AssessmentQuestion", queryCondition, 10000, true);

    //@ts-ignore Get severity levels from config, add to map to eliminate an extra loop further down.
    const severityDisplayOrders = await _RB.selectQuery(["name", "EA_OR_intDisplayOrder"], "EA_OR_SeverityLevel", "", 10000, true);
    const severityDisplayMap = {};
    for (let i = 0; i < severityDisplayOrders.length; i++) {
      severityDisplayMap[severityDisplayOrders[i].name] = severityDisplayOrders[i].EA_OR_intDisplayOrder;
    }

    // Sort the results by severity level display order using the map
    const sortedResults = results.sort((a, b) => {
      // There should always be a display order for each severity level,
      // but if not, default to 0 (lowest display order)
      const severityA = severityDisplayMap[a.EA_OR_txtSeverityLevelName] || 0;
      const severityB = severityDisplayMap[b.EA_OR_txtSeverityLevelName] || 0;
      return severityA - severityB;
    });

    return sortedResults;
  } catch (error) {
    console.log("Error: fetchQuestionsSeverityByTemplateId ", error);
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
    //@ts-ignore
    const results = await _RB.updateRecord("EA_SA_AssessmentQuestion", recordId, fields);
    return results;
  } catch (error) {
    console.log("Error: updateQuestion ", error);
  }
};
