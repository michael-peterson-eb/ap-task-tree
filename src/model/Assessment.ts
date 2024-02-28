/**
 * This module contains all the business logic related to Assessment
 */

import {
  fetchAssessmentQuestionTypeByIds,
  fetchAssessmentQuestionTypes,
} from "./QuestionType";
import { fetchTypesOfAssessmentQuestion } from "./Questions";
import {
  fetchObjectSectionStatuses,
  fetchOpSectionStatus,
  updateStatusJSON,
} from "./SectionStatus";

/**
 *
 * @param questionTypeID
 * @param sectionStatusesJSON
 * @param hasStatusJSON
 */

const xgetAssessmentQuestionType = async (
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

const xgetTypeSectionStatus = (typeId: any, sectionStatus: any) => {
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

const getOpSectionStatus = (opId: any, secStatuses: any) => {
  console.log("--getOpSectionStatus--", opId, secStatuses);
  return secStatuses.find(
    (st: any) => st.EA_SA_rsAssessmentQuestionType === opId
  );
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
  console.log("--assessmentTypes:condition--", qCondition);
  const assessmentTypes = await fetchTypesOfAssessmentQuestion(qCondition);

  console.log("--assessmentTypes--", assessmentTypes);
  if (assessmentTypes.length > 0) {
    let hasStatusJSON = recordInfo?.sectionStatusesJSON != "";

    let currentSectionStatus = await fetchOpSectionStatus(
      recordInfo,
      "EA_SA_Impact"
    );
    console.log("--currentSectionStatus--", currentSectionStatus);
    const aTypeIds: any[] = [];
    assessmentTypes.forEach((type: any) => {
      aTypeIds.push(type.EA_SA_rfQuestionType);
    });

    // get Assessment Question Type (EA_SA_AssessmentQuestionType)
    const assessQTypes = await fetchAssessmentQuestionTypeByIds(aTypeIds);
    console.log("--getAssessQTypes--", assessQTypes, aTypeIds);
    aqTypes = assessQTypes.map((type: any) => {
      return {
        ...type,
        //status: getTypeSectionStatus(type.id, currentSectionStatus),
        opsSection: getOpSectionStatus(type.id, currentSectionStatus),
      };
    });
    console.log("--getgetQuestionTypes--", aqTypes);
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
