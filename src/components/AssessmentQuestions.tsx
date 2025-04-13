import { ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import {
  FormInputCurrency,
  FormInputText,
  FormMultiSelect,
  FormSingleSelect,
  FormTimeInterval,
  FormInputDate,
  FormInputInteger,
  FormInputDecimal,
  FormYesNo,
  FormSeverityLevel,
} from "./Form";
import { setInnerHTML } from "../utils/cleanup";
import { useData } from "../contexts/DataContext";
import { riskFields } from "../data/constants/fields";
import { useQuery } from "@tanstack/react-query";
import { fetchAssessQuestionsByTemplateId } from "../model/Questions";
import { fetchResponseOptionsByTemplateId } from "../model/ResponseOptions";
import { Loading } from "./Loading";

const AssessmentQuestions = ({ appParams, questionTemplateData }): ReactElement | null => {
  const { EA_SA_ddlAskPer: askPer, EA_SA_ddlResponseFormat: responseFormat } = questionTemplateData;
  const { questionUpdates, riskUpdates } = useData();

  // Get Assessment Questions
  const { isPending: assessmentQuestionsPending, data: assessmentQuestions } = useQuery({
    queryKey: [`fetchAssessQuestionByTemplateId2-${questionTemplateData.id}`],
    queryFn: () => fetchAssessQuestionsByTemplateId(appParams, questionTemplateData.id),
  });

  // Get Response Options
  const {
    isPending: assessmentQuestionResponseOptionsPending,
    error,
    data: assessmentQuestionResponseOptions,
  } = useQuery({
    queryKey: [`fetchResponseOptionsByTemplateId-${questionTemplateData.id}`],
    queryFn: () => fetchResponseOptionsByTemplateId(questionTemplateData.id),
    enabled: !!assessmentQuestions,
  });

  const handleChange = (event, { assessmentQuestionId, responseFormat, riskObj, scope = "EA_OR_NORMAL" }) => {
    const { id, name, value } = event.target;
    // if (responseFormat === "MSP") value = concatObjectIds(value); // multi select field
    let fieldValue: any = {};
    if (questionUpdates.current.hasOwnProperty(assessmentQuestionId)) {
      fieldValue = questionUpdates.current[assessmentQuestionId]["fieldValue"];
      fieldValue[name] = value;
    } else {
      fieldValue[name] = value;
    }
    const newUpdatedFields = {
      ...questionUpdates.current,
      [assessmentQuestionId]: {
        ...questionUpdates.current[assessmentQuestionId],
        id: assessmentQuestionId,
        typeId: id,
        type: responseFormat,
        value: value,
        scope: scope,
        fieldValue: fieldValue,
      },
    };
    questionUpdates.current = newUpdatedFields;
    
    if (riskObj && riskFields.includes(riskObj.EA_SA_txtFieldIntegrationName)) {
      riskUpdates.current = { ...riskUpdates.current, [id]: riskObj };
    }
  };

  // Local environment only - Not all data is mocked, displaying a placeholder section
  if (process.env.NODE_ENV === "development") {
    return (
      <Box sx={{ width: "100%" }}>
        <Box sx={{ padding: 2 }}>
          <Typography variant="body2" component="div">
            {setInnerHTML(questionTemplateData.EA_SA_txtaQuestion)}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Wait until data for questions is available
  if (assessmentQuestionsPending || assessmentQuestionResponseOptionsPending) return <Loading type="circular" boxStyles={{ marginY: 2 }} />;

  if (assessmentQuestions && assessmentQuestions.length > 0) {
    return assessmentQuestions.map((assessmentQuestion) => {
      return (
        <>
          {responseFormat === "SSP" && askPer === null && (
            <div style={{ marginTop: 24 }}>
              <FormSingleSelect
                fieldName={"EA_SA_rsAssessmentResponseOptions"}
                appParams={appParams}
                assessmentQuestion={assessmentQuestion}
                assessmentQuestionResponseOptions={assessmentQuestionResponseOptions}
                onChange={handleChange}
                questionTemplateData={questionTemplateData}
                questionUpdates={questionUpdates}
              />
            </div>
          )}
        </>
      );
    });
  }

  return null;
};

export default AssessmentQuestions;

// Single-Select Picklist
// if (responseFormat === "SSP" && askPer == null) {
//   return (
//     <div style={{ marginTop: 24 }}>
//       <FormSingleSelect
//         fieldName={"EA_SA_rsAssessmentResponseOptions"}
//         appParams={appParams}
//         questionTemplateData={questionTemplateData}
//         opSectionData={opSectionData}
//         onChange={handleChange}
//       />
//     </div>
//   );
// }

// askFor Time Interval
// if (data.EA_SA_ddlResponseFormat === "SSP" && askPer == "EA_SA_TimeInterval") {
//   return (
//     //@ts-ignore
//     <FormTimeInterval
//       fieldName={"EA_SA_rsAssessmentResponseOptions"}
//       recordInfo={recordInfo}
//       qtype={qtype}
//       data={data}
//       onChange={handleOnChange}
//       fnSecQA={fnSecQA}
//       fnReqField={fnReqField}
//     />
//   );
// }

// // askFor Severity Level
// if (askPer == "EA_SA_SeverityLevel") {
//   return (
//     //@ts-ignore
//     <FormSeverityLevel
//       fieldName={"nothing"}
//       recordInfo={recordInfo}
//       qtype={qtype}
//       data={data}
//       onChange={handleOnChange}
//       onChangeCustom={onChangeCustom}
//       fnSecQA={fnSecQA}
//       fnReqField={fnReqField}
//     />
//   );
// }

// // Text Response
// if (data.EA_SA_ddlResponseFormat === "FRES") {
//   return (
//     <div style={{ marginTop: 24 }}>
//       <FormInputText
//         fieldName={"EA_SA_txtaResponse"}
//         recordInfo={recordInfo}
//         qtype={qtype}
//         data={data}
//         onChange={handleOnChange}
//         lookup={lookupFV}
//         fnSecQA={fnSecQA}
//         fnReqField={fnReqField}
//       />
//     </div>
//   );
// }

// // MSP - Multi-Select
// if (data.EA_SA_ddlResponseFormat === "MSP") {
//   return (
//     <div style={{ marginTop: 24 }}>
//       <FormMultiSelect
//         fieldName={"EA_SA_txtaResponse"}
//         recordInfo={recordInfo}
//         qtype={qtype}
//         data={data}
//         onChange={onChangeCustom}
//         lookup={lookupFV}
//         fnSecQA={fnSecQA}
//         fnReqField={fnReqField}
//       />
//     </div>
//   );
// }

// // CCY - Currency
// if (data.EA_SA_ddlResponseFormat === "CCY") {
//   return (
//     <div style={{ marginTop: 24 }}>
//       <FormInputCurrency fieldName={"EA_SA_curResponse"} recordInfo={recordInfo} qtype={qtype} data={data} lookup={lookupFV} onChange={handleOnChange} />
//     </div>
//   );
// }

// // DATE - Date
// if (data.EA_SA_ddlResponseFormat === "DATE") {
//   return (
//     <div style={{ marginTop: 24 }}>
//       <FormInputDate
//         fieldName={"EA_SA_ddResponse"}
//         recordInfo={recordInfo}
//         qtype={qtype}
//         data={data}
//         onChange={onChangeCustom}
//         lookup={lookupFV}
//         fnSecQA={fnSecQA}
//         fnReqField={fnReqField}
//       />
//     </div>
//   );
// }

// // INT - Integer
// if (data.EA_SA_ddlResponseFormat === "INT") {
//   return (
//     <div style={{ marginTop: 24 }}>
//       <FormInputInteger
//         fieldName={"EA_SA_intResponse"}
//         recordInfo={recordInfo}
//         qtype={qtype}
//         data={data}
//         onChange={onChangeCustom}
//         lookup={lookupFV}
//         fnSecQA={fnSecQA}
//         fnReqField={fnReqField}
//       />
//     </div>
//   );
// }

// // DEC - Decimal
// if (data.EA_SA_ddlResponseFormat === "DEC") {
//   return (
//     <div style={{ marginTop: 24 }}>
//       <FormInputDecimal
//         fieldName={"EA_SA_decResponse"}
//         recordInfo={recordInfo}
//         qtype={qtype}
//         data={data}
//         onChange={onChangeCustom}
//         lookup={lookupFV}
//         fnSecQA={fnSecQA}
//         fnReqField={fnReqField}
//       />
//     </div>
//   );
// }

// // YN - Yes/No
// if (data.EA_SA_ddlResponseFormat === "YN") {
//   return (
//     <div style={{ marginTop: 24 }}>
//       <FormYesNo
//         fieldName={"EA_SA_rsAssessmentResponseOptions"}
//         recordInfo={recordInfo}
//         qtype={qtype}
//         data={data}
//         onChange={handleOnChange}
//         lookup={lookupFV}
//         fnSecQA={fnSecQA}
//         fnReqField={fnReqField}
//       />
//     </div>
//   );
// }
