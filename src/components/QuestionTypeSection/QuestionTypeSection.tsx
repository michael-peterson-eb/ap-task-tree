//@ts-nocheck
import { useState, useEffect, useRef } from "react";
import { Box, ThemeProvider, Checkbox, FormControlLabel, Alert, AlertTitle, Typography } from "@mui/material";

import { FormInputCurrency } from "../Form/FormInputCurrency";
import { FormInputText } from "../Form/FormInputText";
import { FormMultiSelect } from "../Form/FormMultiSelect";
import { FormSingleSelect } from "../Form/FormSingleSelect";
import { FormTimeInterval } from "../Form/FormTimeInterval";
import { FormInputDate } from "../Form/FormInputDate";
import { CustomFontTheme } from "../../style/CustomTheme";
import { FormInputInteger } from "../Form/FormInputInteger";
import { FormInputDecimal } from "../Form/FormInputDecimal";
import { FormYesNo } from "../Form/FormInputYesNo";
import { FormSeverityLevel } from "../Form/FormSeverityLevel";

import { getAssessmentQuestionTemplateByType, getAssessmentQuestionByType } from "../../model/QuestionTemplates";

import { fetchAssessQuestionsByTemplateId, fetchQuestionsIntervalsByTemplateId } from "../../model/Questions";

import { initSelectValue, getValue, getQuestionAnswer } from "../../utils/common";

const QuestionTypeSection = (props: any) => {
  const { recordInfo, qtype, handleFormValues, handleOnChange, customChangedHandler, lookupFV, fnSecQs, fnSecQA, fnDoneWithReqField } = props;

  const [tableData, setTableData] = useState([]);
  const [isTypeCompleted, setTypeCompleted] = useState(false);
  const [isReqFieldValid, setReqFieldValid] = useState(true);

  const editMode = recordInfo.crudAction === "edit";

  const setFormValues = (data: any) => {
    const formValues: any = {};
    data.forEach((d: any) => {
      formValues[d.id] = {
        value: "",
        error: false,
        errorMsg: "Cannot be blank",
      };
    });
    handleFormValues(formValues);
  };

  const setOptionValues = (data: any) => {
    const optionValues: any = {};
    data.forEach((datum: any) => {
      optionValues[datum.id] = {
        value: "",
        error: false,
        errorMsg: "Cannot be blank",
      };
    });
  };

  const checkRequiredFields = () => {
    const validRF = fnDoneWithReqField();
    if (isTypeCompleted && !validRF) {
      customChangedHandler("STATUS", null, { name: qtype.id, value: false }, null);
      setTypeCompleted(false);
    }
    setReqFieldValid(validRF);
  };

  const getExistingAnswers = (templateData: any) => {
    const asQs: any[] = [];
    const secQs = templateData.map(async (data: any) => {
      const tId = data.id;
      let qValue = "";
      if (data.EA_SA_ddlResponseFormat === "SSP" && data.EA_SA_cbAskPerTimeInterval == 1) {
        const intervalQuestions = await fetchQuestionsIntervalsByTemplateId(recordInfo, tId);
      } else {
        const assessQuestions = await fetchAssessQuestionsByTemplateId(recordInfo, tId);
        const [found, qaId, newValue] = getQuestionAnswer(recordInfo, lookupFV, assessQuestions, "EA_SA_txtaResponse");

        if (found) fnSecQA(tId, qaId, newValue);
        qValue = newValue;
      }
      return { ...data, ...{ value: qValue } };
    });

    Promise.all(secQs).then((sQs) => {
      fnSecQs(sQs); // track section questions state
    });
  };

  useEffect(() => {
    setTypeCompleted(qtype.status === "completed" ? true : false);

    // get from Assessement Question Template (EA_SA_AssessmentQuestionTemplate)
    getAssessmentQuestionTemplateByType(qtype).then((data) => {
      setTableData(data);
      if (editMode) {
        //fnSecQs(data);  // track section questions state
        getExistingAnswers(data);

        setTimeout(() => {
          checkRequiredFields();
        }, 500);
      }
    });
  }, [qtype.id]);

  return (
    <ThemeProvider theme={CustomFontTheme}>
      <Box sx={{ marginTop: "32px" }}>
        <span style={{ fontSize: "18px", fontWeight: "bold", fontStyle: "normal" }}>{qtype.name}</span>
      </Box>
      <Box sx={{ margin: "auto", overflow: "auto" }}>
        {recordInfo.crudAction === "view" && !isTypeCompleted && (
          <Alert sx={{ marginTop: "12px" }} severity="warning">
            <AlertTitle>{`${qtype.name} ${recordInfo.objectTitle} is in progress!`}</AlertTitle>
          </Alert>
        )}
        {recordInfo.crudAction === "view" && isTypeCompleted && (
          <Alert sx={{ marginTop: "12px" }} severity="success">
            <AlertTitle>{`${qtype.name} ${recordInfo.objectTitle} is complete!`}</AlertTitle>
          </Alert>
        )}

        {tableData.length > 0 &&
          tableData.map((data: any) => {
            // Single-Select Picklist
            const askTimeIntval = data.EA_SA_cbAskPerTimeInterval;
            const askPer = data.EA_SA_ddlAskPer; // values are EA_SA_TimeInterval, EA_SA_SeverityLevel

            if (data.EA_SA_ddlResponseFormat === "SSP" && askPer == null) {
              return (
                <div style={{ marginTop: 24 }}>
                  <FormSingleSelect
                    fieldName={"EA_SA_rsAssessmentResponseOptions"}
                    recordInfo={recordInfo}
                    qtype={qtype}
                    data={data}
                    onChange={handleOnChange}
                    lookup={lookupFV}
                    fnSecQA={fnSecQA}
                    fnReqField={checkRequiredFields}
                  />
                </div>
              );
            }

            // askFor Time Interval
            if (data.EA_SA_ddlResponseFormat === "SSP" && askPer == "EA_SA_TimeInterval") {
              return (
                <FormTimeInterval
                  fieldName={"EA_SA_rsAssessmentResponseOptions"}
                  recordInfo={recordInfo}
                  qtype={qtype}
                  data={data}
                  onChange={handleOnChange}
                  lookup={lookupFV}
                  fnSecQA={fnSecQA}
                  fnReqField={checkRequiredFields}
                />
              );
            }

            // askFor Severity Level
            if (askPer == "EA_SA_SeverityLevel") {
              return (
                <FormSeverityLevel
                  fieldName={"nothing"}
                  recordInfo={recordInfo}
                  qtype={qtype}
                  data={data}
                  onChange={handleOnChange}
                  onChangeCustom={customChangedHandler}
                  lookup={lookupFV}
                  fnSecQA={fnSecQA}
                  fnReqField={checkRequiredFields}
                />
              );
            }

            // Text Response
            if (data.EA_SA_ddlResponseFormat === "FRES") {
              return (
                <div style={{ marginTop: 24 }}>
                  <FormInputText
                    fieldName={"EA_SA_txtaResponse"}
                    recordInfo={recordInfo}
                    qtype={qtype}
                    data={data}
                    onChange={handleOnChange}
                    lookup={lookupFV}
                    fnSecQA={fnSecQA}
                    fnReqField={checkRequiredFields}
                  />
                </div>
              );
            }

            // MSP - Multi-Select
            if (data.EA_SA_ddlResponseFormat === "MSP") {
              return (
                <div style={{ marginTop: 24 }}>
                  <FormMultiSelect
                    fieldName={"EA_SA_txtaResponse"}
                    recordInfo={recordInfo}
                    qtype={qtype}
                    data={data}
                    onChange={customChangedHandler}
                    lookup={lookupFV}
                    fnSecQA={fnSecQA}
                    fnReqField={checkRequiredFields}
                  />
                </div>
              );
            }

            // CCY - Currency
            if (data.EA_SA_ddlResponseFormat === "CCY") {
              return (
                <div style={{ marginTop: 24 }}>
                  <FormInputCurrency fieldName={"EA_SA_curResponse"} recordInfo={recordInfo} qtype={qtype} data={data} lookup={lookupFV} onChange={handleOnChange} />
                </div>
              );
            }

            // DATE - Date
            if (data.EA_SA_ddlResponseFormat === "DATE") {
              return (
                <div style={{ marginTop: 24 }}>
                  <FormInputDate
                    fieldName={"EA_SA_ddResponse"}
                    recordInfo={recordInfo}
                    qtype={qtype}
                    data={data}
                    onChange={customChangedHandler}
                    lookup={lookupFV}
                    fnSecQA={fnSecQA}
                    fnReqField={checkRequiredFields}
                  />
                </div>
              );
            }

            // INT - Integer
            if (data.EA_SA_ddlResponseFormat === "INT") {
              return (
                <div style={{ marginTop: 24 }}>
                  <FormInputInteger
                    fieldName={"EA_SA_intResponse"}
                    recordInfo={recordInfo}
                    qtype={qtype}
                    data={data}
                    onChange={customChangedHandler}
                    lookup={lookupFV}
                    fnSecQA={fnSecQA}
                    fnReqField={checkRequiredFields}
                  />
                </div>
              );
            }

            // DEC - Decimal
            if (data.EA_SA_ddlResponseFormat === "DEC") {
              return (
                <div style={{ marginTop: 24 }}>
                  <FormInputDecimal
                    fieldName={"EA_SA_decResponse"}
                    recordInfo={recordInfo}
                    qtype={qtype}
                    data={data}
                    onChange={customChangedHandler}
                    lookup={lookupFV}
                    fnSecQA={fnSecQA}
                    fnReqField={checkRequiredFields}
                  />
                </div>
              );
              return;
            }

            // YN - Yes/No
            if (data.EA_SA_ddlResponseFormat === "YN") {
              return (
                <div style={{ marginTop: 24 }}>
                  <FormYesNo
                    fieldName={"EA_SA_rsAssessmentResponseOptions"}
                    recordInfo={recordInfo}
                    qtype={qtype}
                    data={data}
                    onChange={handleOnChange}
                    lookup={lookupFV}
                    fnSecQA={fnSecQA}
                    fnReqField={checkRequiredFields}
                  />
                </div>
              );
            }
          })}

        {editMode && (
          <Alert sx={{ marginTop: "12px", marginBottom: "6px" }} severity="info">
            <AlertTitle>{recordInfo.objectTitle}</AlertTitle>
            <FormControlLabel
              control={
                <Checkbox
                  id={qtype.id}
                  name={qtype.id}
                  checked={isTypeCompleted}
                  onChange={(event: any) => {
                    const checked = event.target.checked;
                    qtype.status = checked ? "completed" : "on-going";
                    if (recordInfo.crudAction === "edit") {
                      setTypeCompleted(checked);
                      customChangedHandler("STATUS", event, { id: qtype.id, name: qtype.id, value: checked }, null);
                    }
                  }}
                  disabled={!isReqFieldValid}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label={`Checked if ${qtype.name} ${recordInfo.objectTitle} is complete!`}
            />
          </Alert>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default QuestionTypeSection;


// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getAssessmentQuestionTemplateByType } from "../../queries/assessmentQuestionTemplate";
// import QuestionTypeSectionHeader from "./QuestionTypeSectionHeader";
// import { Box } from "@mui/material";
// import { FormSingleSelect } from "../FormSingleSelect";

// const QuestionTypeSection = ({ currentOpsSectionInfo, appParams }) => {
//   const { crudAction: mode, objectTitle } = appParams;
//   const { id, name: questionName, status, EA_SA_rsAssessmentQuestionType, EA_SA_rsAssessmentQuestions, EA_SA_txtCode } = currentOpsSectionInfo;

//   const {
//     isPending: assessmentQuestionsPending,
//     error,
//     data: assessmentQuestions,
//   } = useQuery({
//     queryKey: [`assessmentQuestions-${id}`],
//     queryFn: () => getAssessmentQuestionTemplateByType({ EA_SA_rsAssessmentQuestionType }),
//   });

//   console.log("assessmentQuestions", assessmentQuestions);

//   if (assessmentQuestionsPending) return null;

//   return (
//     <>
//       <QuestionTypeSectionHeader mode={mode} status={status} objectTitle={objectTitle} questionName={questionName} />
//       <Box sx={{ margin: "auto", overflow: "auto" }}>
//         {assessmentQuestions.map((question) => {
//           const askTimeIntval = question.EA_SA_cbAskPerTimeInterval;
//           const askPer = question.EA_SA_ddlAskPer;
//           const responseFormat = question.EA_SA_ddlResponseFormat;

//           if (responseFormat === "SSP" && askPer == null) {
//             return (
//               <div style={{ marginTop: 24 }}>
//                 <FormSingleSelect
//                   fieldName={"EA_SA_rsAssessmentResponseOptions"}
//                   recordInfo={appParams}
//                   qtype={qtype}
//                   data={question}
//                   onChange={() => {}}
//                   lookup={lookupFV}
//                   fnSecQA={() =>}
//                   fnReqField={()=>{}}
//                 />
//               </div>
//             );
//           }
//         })}
//       </Box>
//     </>
//   );
// };

// export default QuestionTypeSection;
