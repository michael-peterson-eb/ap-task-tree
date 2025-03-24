export const fetchObjectSectionStatuses = async (recordInfo: any) => {
  try {
    let status = "{}";
    const queryCondition = `id=${recordInfo?.id}`;

    const results = await _RB.selectQuery(["EA_SA_txtaSectionStatuses"], recordInfo?.objectIntegrationName, queryCondition, 1, true);

    if (results.length > 0) status = results[0];
    return status;
  } catch (error) {
    console.log("Error: fetchObjectSectionStatuses ", error);
  }
};

/**
 * get Operations Section by section type and Display Section is enabled
 * @param queryCondition
 * @returns
 */
export const fetchOpSectionStatus = async (recordInfo: any, sectionType: any) => {
  try {
    let queryCondition = `${recordInfo.questionRelName}=${recordInfo?.id}`;
    queryCondition = queryCondition + ` AND EA_SA_ddlSectionType#code='${sectionType}'`;
    queryCondition = queryCondition + ` AND EA_SA_cbDisplaySection=1`; 

    //console.log("fetchOpSectionStatus:condition", queryCondition)
    const results = await _RB.selectQuery(
      ["id", "name", "status#code", "EA_SA_txtCode", "EA_SA_rsAssessmentQuestionType", "EA_SA_rsAssessmentQuestions"],
      "EA_SA_OperationsSection",
      queryCondition,
      100,
      true
    );
    return results;

  } catch (error) {
    console.log("Error: fetchOpSectionStatus ", error);
  }
};

export const fetchOpSectionBySource = async (recordInfo: any) => {
  try {
    const queryCondition = `${recordInfo.questionRelName}=${recordInfo?.id}`;
    const results = await _RB.selectQuery(
      ["id", "name", "status#code", "EA_SA_txtCode", "EA_SA_rsAssessmentQuestionType", "EA_SA_rsAssessmentQuestions"],
      "EA_SA_OperationsSection",
      queryCondition,
      100,
      true
    );

    //if (results.length > 0) status = results[0];
    return results;
  } catch (error) {
    console.log("Error: fetchOpSectionBySource ", error);
  }
};


/**
 * update Operation Section status
 * @param opSecId
 * @param value
 * @returns
 */
export const updateOpSectionStatus = async (opSec: any, value: string) => {
  try {
    const results = await _RB.updateRecord("EA_SA_OperationsSection", opSec.id, {
      status: value,
    });
    return results;
  } catch (error) {
    console.log("Error: updateOpSectionStatus ", error);
  }
};

export const updateStatusJSON = async (recordInfo: any, value: any) => {
  try {
    let fields = {
      EA_SA_txtaSectionStatuses: JSON.stringify(value),
    };

    const results = await _RB.updateRecord(recordInfo.objectIntegrationName, recordInfo.id, fields);

    return results;
  } catch (error) {
    console.log("Error: updateStatusJSON ", error);
  }
};
