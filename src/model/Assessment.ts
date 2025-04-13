/**
 * This module contains all the business logic related to Assessment
 */

import { fetchAssessmentQuestionTypeByIds, fetchAssessmentQuestionTypes } from "./QuestionType";
import { fetchTypesOfAssessmentQuestion } from "./Questions";
import { fetchObjectSectionStatuses, fetchOpSectionBySource, fetchOpSectionStatus, updateStatusJSON } from "./SectionStatus";

const getOpSectionStatus = (opId: any, secStatuses: any) => {
  return secStatuses.find((st: any) => st.EA_SA_rsAssessmentQuestionType === opId);
};

/**
 *
 * @param recordInfo
 * @param questionTypes
 * @returns
 */
export const getQuestionTypes = async (recordInfo: any) => {
  // get current section status
  let currentSectionStatus = {};
  let aqTypes = [];

  // Get Assessment Type by Related Assessment Question (EA_SA_AssessmentQuestion)
  const qCondition = `${recordInfo.questionRelName} IN (${recordInfo.id})`;
  const assessmentTypes = await fetchTypesOfAssessmentQuestion(qCondition);

  if (assessmentTypes.length > 0) {
    let hasStatusJSON = recordInfo?.sectionStatusesJSON != "";

    // let currentSectionStatus = await fetchOpSectionStatus(
    //   recordInfo,
    //   "EA_SA_Impact"
    // );

    let currentSectionStatus = await fetchOpSectionStatus(recordInfo, recordInfo.sectionType);

    const aTypeIds: any[] = [];
    assessmentTypes.forEach((type: any) => {
      aTypeIds.push(type.EA_SA_rfQuestionType);
    });

    // get Assessment Question Type (EA_SA_AssessmentQuestionType)
    const assessQTypes = await fetchAssessmentQuestionTypeByIds(aTypeIds);
    aqTypes = assessQTypes.map((type: any) => {
      return {
        ...type,
        //status: getTypeSectionStatus(type.id, currentSectionStatus),
        opsSection: getOpSectionStatus(type.id, currentSectionStatus),
      };
    });
    // Validate Section statuses and updates when empty
    if (!hasStatusJSON) {
      await updateStatusJSON(recordInfo, currentSectionStatus);
    }
  }

  return aqTypes; // return empty array or arrays of question types
};

export const getOperationStatus = async (recordInfo: any) => {
  const opSection = await fetchOpSectionStatus(recordInfo, recordInfo.sectionType);
  return opSection;
};
