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
 * get Operations Section status
 * @param queryCondition
 * @returns
 */
export const fetchOpSectionStatus = async (recordInfo: any, sectionType: any) => {
  try {
    const queryCondition = `${recordInfo.questionRelName}=${recordInfo?.id} AND EA_SA_ddlSectionType#code='${sectionType}'`;
    // console.log("--fetchOpSectionStatus--", queryCondition);
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
    console.log("Error: fetchOpSectionStatus ", error);
  }
};

/**
 * get Process's section status
 * @param recordInfo Process record info
 * @param sectionType e.g. EA_SA_Impact, EA_SA_Dependency, EA_SA_Resource
 * @returns
 */
export const xfetchProcessOpsSectionStatus = async (recordInfo: any, sectionType: string) => {
  const queryCondition = `EA_SA_rsProcess=${recordInfo?.id} AND EA_SA_ddlSectionType#code=${sectionType}`;
  return await fetchOpSectionStatus(queryCondition);
};

/**
 * get Product and Service's section status
 * @param recordInfo Product and Service record info
 * @param sectionType e.g. EA_SA_Impact, EA_SA_Dependency, EA_SA_Resource
 * @returns
 */
export const xfetchPSOpsSectStatus = async (recordInfo: any, sectionType: string) => {
  const queryCondition = `EA_SA_rsProductAndService=${recordInfo?.id} AND EA_SA_ddlSectionType#code=${sectionType}`;
  return await fetchOpSectionStatus(queryCondition);
};

/**
 * get Application's section status
 * @param recordInfo Application record info
 * @param sectionType e.g. EA_SA_Impact, EA_SA_Dependency, EA_SA_Resource
 * @returns
 */
export const xfetchAppOpsSectStatus = async (recordInfo: any, sectionType: string) => {
  const queryCondition = `EA_SA_rsApplication=${recordInfo?.id} AND EA_SA_ddlSectionType#code=${sectionType}`;
  return await fetchOpSectionStatus(queryCondition);
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
