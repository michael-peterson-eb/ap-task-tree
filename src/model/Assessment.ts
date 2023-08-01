/**
 * This module contains all the business logic related to Assessment
 */

import {
  fetchAssessmentQuestionTypeByIds,
  fetchAssessmentQuestionTypes,
} from "./QuestionType";
import { fetchTypesOfAssessmentQuestion } from "./Questions";
import { fetchObjectSectionStatuses, updateStatusJSON } from "./SectionStatus";

/**
 *
 * @param questionTypeID
 * @param sectionStatusesJSON
 * @param hasStatusJSON
 */

const getAssessmentQuestionType = async (
  questionTypeID: any,
  sectionStatusesJSON: any,
  hasStatusJSON: any,
  questionTypes: any
) => {
  const sectionStatus = sectionStatusesJSON;

  // Get Assessment Question Type Name By ID
  const fetchResults = await fetchTypesOfAssessmentQuestion(questionTypeID);

  const assessmentTypeName = fetchResults[0]["name"];

  // Set default status
  if (!hasStatusJSON) {
    sectionStatus[`type-${questionTypeID}`] = "not-started";
  }

  // Store Question Type with Question Templates
  const status = hasStatusJSON
    ? JSON.parse(sectionStatusesJSON[0]["EA_SA_txtaSectionStatuses"])[
        `type-${questionTypeID}`
      ]
    : "not-started";

  questionTypes.set(questionTypeID, {
    id: questionTypeID,
    status: hasStatusJSON ? status : "not-started",
    name: assessmentTypeName,
    items: [],
  });
};

const getTypeSectionStatus = (typeId: any, sectionStatus: any) => {
  const objKey = `type-${typeId}`;
  if (
    sectionStatus != undefined &&
    Object.keys(sectionStatus).length > 0 &&
    sectionStatus.hasOwnProperty(objKey)
  ) {
    return sectionStatus[objKey];
  } else {
    return "not-started";
  }
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

  // Get Assessment Type by Related Assessment Question
  const qCondition = `${recordInfo.questionRelName} IN (${recordInfo.id})`;
  const assessmentTypes = await fetchTypesOfAssessmentQuestion(qCondition);

  if (assessmentTypes.length > 0) {
    let hasStatusJSON = recordInfo?.sectionStatusesJSON != "";

    // Get Object Status Section JSON
    let sectionStatus = await fetchObjectSectionStatuses(recordInfo);
    if (hasStatusJSON) {
      currentSectionStatus = JSON.parse(
        sectionStatus.EA_SA_txtaSectionStatuses
      );
    }

    const aTypeIds: any[] = [];
    assessmentTypes.forEach((type: any) => {
      aTypeIds.push(type.EA_SA_rfQuestionType);
    });

    const assessQTypes = await fetchAssessmentQuestionTypeByIds(aTypeIds);
    aqTypes = assessQTypes.map((type: any) => {
      return {
        ...type,
        status: getTypeSectionStatus(type.id, currentSectionStatus),
      };
    });

    // Validate Section statuses and updates when empty
    if (!hasStatusJSON) {
      await updateStatusJSON(recordInfo, currentSectionStatus);
    }
  }

  return aqTypes; // return empty array or arrays of question types
};
