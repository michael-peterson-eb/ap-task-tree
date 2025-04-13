import { Box } from "@mui/material";
import { Loading } from "../Loading";
import QuestionTypeSectionHeader from "./QuestionTypeSectionHeader";
import { getAssessmentQuestionTemplateByType } from "../../model/mocked/assessmentQuestionTemplate";
import AssessmentQuestions from "../AssessmentQuestions";
import { useQuery } from "@tanstack/react-query";
import { EditAlert } from "../EditAlert";

const QuestionTypeSection = ({ appParams, currentOpsSectionInfo }) => {
  const { crudAction: mode, objectTitle } = appParams;
  const { id, name: questionName, status, EA_SA_rsAssessmentQuestionType } = currentOpsSectionInfo;

  const { isPending: questionTemplatePending, data: questionTemplate } = useQuery({
    queryKey: [`questionTemplateSections-${id}-${mode}`],
    queryFn: () => getAssessmentQuestionTemplateByType({ EA_SA_rsAssessmentQuestionType: EA_SA_rsAssessmentQuestionType }),
  });

  if (questionTemplatePending) return <Loading />;

  return (
    <>
      <QuestionTypeSectionHeader mode={mode} status={status} objectTitle={objectTitle} questionName={questionName} />
      <Box sx={{ margin: "auto", overflow: "auto" }}>
        {questionTemplate.length > 0 &&
          questionTemplate.map((questionTemplateData) => {
            return <AssessmentQuestions key={`assessment-questions-${questionTemplateData.id}`} appParams={appParams} questionTemplateData={questionTemplateData} />;
          })}
        <EditAlert />
      </Box>
    </>
  );
};

export default QuestionTypeSection;

// const trackUpdatedQuestions = (fieldName: string, typeId: any, fieldType: any, aqId: any, value: any, scope: any) => {
//   const currentUpdatedFields: any = questionUpdates.current;

//   if (fieldType === "MSP") value = concatObjectIds(value); // multi select field

//   let fieldValue: any = {};
//   if (currentUpdatedFields.hasOwnProperty(aqId)) {
//     fieldValue = currentUpdatedFields[aqId]["fieldValue"];
//     fieldValue[fieldName] = value;
//   } else {
//     fieldValue[fieldName] = value;
//   }

//   const newUpdatedFields = {
//     ...currentUpdatedFields,
//     [aqId]: {
//       ...currentUpdatedFields[aqId],
//       id: aqId,
//       typeId: typeId,
//       type: fieldType,
//       value: value,
//       scope: scope,
//       fieldValue: fieldValue,
//     },
//   };

//   questionUpdates.current = newUpdatedFields;

//   console.log("questionUpdates.current !!", questionUpdates.current);
// };

// const fnDoneWithReqField = () => {
//   const secQAs: any = opSecUpdates.current;
//   let nValid: any = 0;
//   for (const sQS in secQAs) {
//     const sQAV = secQAs[sQS];

//     // increment counter if field is required and value is empty
//     if (sQAV.isRequired && sQAV.value == "") nValid++;
//   }

//   return nValid === 0; // true is counter is 0, otherwise false
// };

// update individual section question value
// const setSectionQuestionAnswer = (fieldName: string, typeId: any, aqtId: any, qAns: any) => {
//   let secQAs: any = opSecUpdates.current;
//   if (secQAs.hasOwnProperty(aqtId)) {
//     const currObj = secQAs[aqtId];
//     secQAs = {
//       ...secQAs,
//       [aqtId]: {
//         ...currObj,
//         ...{ field: fieldName, value: qAns },
//       },
//     };
//   }
//   opSecUpdates.current = secQAs;
// };

// const customChangedHandler = (type: any, _event: any, fieldValue: any, aqAnswer: any, scope: any = "EA_OR_NORMAL") => {
//   let { id, name, value } = fieldValue;
//   let aqtId = id;
//   if (type != "STATUS") aqtId = aqAnswer.EA_SA_rsAssessmentQuestionTemplate;

//   switch (type) {
//     case "DATE":
//       value = dateYYYYMMDDFormat(value.toString());
//       break;
//     case "INT":
//       value = Math.round(Number(value.replace(/[^\d.-]/g, "")));
//       break;
//     case "DEC":
//       value = Number(value.replace(/[^\d.-]/g, ""));
//       break;
//     default:
//       value = value;
//   }

//   trackUpdatedQuestions(name, id, type, id, value, scope);
//   setSectionQuestionAnswer(name, id, aqtId, value);
// };

// const handleOnChange = async (type: any, event: any, aqAnswer: any, scope: any = "EA_OR_NORMAL", riskObj: any = null) => {
//   const { id, name, value } = event.target;
//   console.log("VALS", id, name, value); // id=typeId name=questionId
//   const aqtId = aqAnswer.EA_SA_rsAssessmentQuestionTemplate;

//   if (riskObj && riskFields.includes(riskObj.EA_SA_txtFieldIntegrationName)) {
//     riskUpdates.current = { ...riskUpdates.current, [id]: riskObj };
//   }

//   trackUpdatedQuestions(name, id, type, id, value, scope);
//   setSectionQuestionAnswer(name, id, aqtId, value);
// };

// set all section questions ref state
// const setSectionQuestions = (secQs: any) => {
//   let qObj = {};
//   for (let sQ of secQs) {
//     qObj = {
//       ...qObj,
//       [sQ.id]: {
//         fieldType: sQ.EA_SA_ddlResponseFormat,
//         isRequired: sQ.EA_SA_cbRequiredQuestion === 1,
//         isTimeInterval: sQ.EA_SA_cbAskPerTimeInterval === 1,
//         value: sQ.value,
//         EA_SA_txtFieldIntegrationName: sQ.EA_SA_txtFieldIntegrationName,
//       },
//     };
//   }
//   opSecUpdates.current = qObj;
// };

// const getExistingAnswers = (templateData: any) => {
//   const asQs: any[] = [];
//   const secQs = templateData.map(async (data: any) => {
//     const tId = data.id;
//     let qValue = "";
//     if (data.EA_SA_ddlResponseFormat === "SSP" && data.EA_SA_cbAskPerTimeInterval == 1) {
//       const intervalQuestions = await fetchQuestionsIntervalsByTemplateId(appParams, tId);
//     } else {
//       const assessQuestions = await fetchAssessQuestionsByTemplateId(appParams, tId);

//       const [found, qaId, newValue] = getQuestionAnswer(appParams, lookupFV, assessQuestions, "EA_SA_txtaResponse", questionUpdates.current);

//       //@ts-ignore
//       if (found) setSectionQuestionAnswer(tId, qaId, newValue);
//       qValue = newValue;
//     }
//     return { ...data, ...{ value: qValue } };
//   });

//   Promise.all(secQs).then((sQs) => {
//     setSectionQuestions(sQs); // track section questions state
//   });
// };

// const checkRequiredFields = () => {
//   const validRF = fnDoneWithReqField();
//   if (isTypeCompleted && !validRF) {
//     customChangedHandler("STATUS", null, { name: currentOpsSectionInfo.id, value: false }, null);
//     setTypeCompleted(false);
//   }
//   setReqFieldValid(validRF);
// };
