/**
 *
 * @param aqCondition
 * @returns
 */
export const fetchAssessmentQuestionTypes = async (aqCondition: string) => {
  try {
    const condition = `${aqCondition} AND EA_SA_rfQuestionType <> 'null' GROUP BY EA_SA_rfQuestionType ORDER BY EA_SA_rfQuestionType`;

    //@ts-ignore
    const results = await _RB.selectQuery(["EA_SA_rfQuestionType"], "EA_SA_AssessmentQuestion", condition, 10000, true);
    return results;
  } catch (error) {
    console.log("Error: fetchAssessmentQuestionTypes ", error);
  }
};

/**
 *
 * @param id
 * @returns
 */
export const fetchAssessmentQuestionTypeById = async (id) => {
  const res = await fetchAssessmentQuestionTypeByIds([id]);
  let result = null;
  if (res.length > 0) result = res[0];
  return result;
};

export const fetchAssessmentQuestionTypeByIds = async (ids: Number[]) => {
  try {
    const condition = `id IN (${ids.join(",")})`;
    //@ts-ignore
    const results = await _RB.selectQuery(["id", "name"], "EA_SA_AssessmentQuestionType", condition, 1000, true);
    return results;
  } catch (error) {
    console.log("Error: fetchAssessmentQuestionTypeByIds ", error);
  }
};
