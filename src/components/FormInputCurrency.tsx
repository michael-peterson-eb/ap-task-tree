import { useEffect, useState, Fragment, useRef } from "react";
import { FormInputProps } from "./FormInputProps";

import { FormControl, TextField, InputAdornment } from "@mui/material";

import { getAssessmentQuestion } from "../model/Questions";

import { initSelectValue, getValue, isQuestionRequired, showLabel } from "../common/Utils";

import { fieldLabel } from "./Helpers";
import { FieldValue } from "./DisplayFieldValue";

export const FormInputCurrency = (props: FormInputProps) => {
  const { fieldName, recordInfo, qtype, data, onChange, lookup, fnSecQA, fnReqField, preloadedAQ, withLabel } = props;

  const [assessQuestions, setAssessQuestion] = useState([]);
  const [fieldValue, setFieldValue] = useState("");
  const aqAnswer = useRef(null);

  const templateId = data.id;

  useEffect(() => {
    const fetchQuestionsAndOptions = async () => {
      const assessQuestionsResp: any = await getAssessmentQuestion(recordInfo, templateId, preloadedAQ);
      setAssessQuestion(assessQuestionsResp);


      if (assessQuestionsResp && assessQuestionsResp.length > 0) {
        const aqId = assessQuestionsResp[0].id;
        const aqFieldValue = fieldName != null ? assessQuestionsResp[0][fieldName] : "";
        const lookupValue = lookup(aqId);

        let responseValue = aqFieldValue ? aqFieldValue : "";
        if (lookupValue || lookupValue == "") responseValue = lookupValue;

        const respValue = getValue(lookup, aqId, aqFieldValue);
        const newValue = initSelectValue(recordInfo, respValue);
        
        setFieldValue(newValue);
        aqAnswer.current = assessQuestionsResp[0];
      }
    };
    fetchQuestionsAndOptions().catch(console.error);
  }, [templateId]);

  return (
    <Fragment>
      {assessQuestions.length > 0 &&
        assessQuestions.map((aq: any) => (
          <FormControl fullWidth variant="standard">
            {recordInfo.crudAction == "edit" && (
              <TextField
                sx={{ m: 0, "&:hover": { backgroundColor: "transparent" } }}
                required={isQuestionRequired(aq.EA_SA_rfRequiredQuestion)}
                id={aq.id}
                label={showLabel(withLabel, fieldLabel(data.EA_SA_txtaQuestion))}
                name={fieldName}
                value={fieldValue}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">US$</InputAdornment>,
                  inputMode: "numeric",
                  style: { fontSize: "14px" },
                  ...(recordInfo.crudAction == "view" ? { readOnly: true } : { readOnly: false }),
                }}
                InputLabelProps={{ style: { fontSize: "18px", backgroundColor: "#FFF" } }}
                onChange={(event: any) => {
                  const { id, name, value } = event.target;

                  let riskObj: any = null;
                  if (recordInfo.objectIntegrationName === "EA_RM_Risk") {
                    riskObj = { EA_SA_txtAssmtRespOptCode: value, EA_SA_txtFieldIntegrationName: data.EA_SA_txtFieldIntegrationName };
                  }

                  setFieldValue(value);
                  onChange("DEC", event, aqAnswer.current, null, riskObj);
                  fnReqField();
                }}
                error={isQuestionRequired(aq.EA_SA_rfRequiredQuestion) && !fieldValue}
                helperText={isQuestionRequired(aq.EA_SA_rfRequiredQuestion) && !fieldValue ? "This question is required!" : ""}
              />
            )}
            {recordInfo.crudAction == "view" && <FieldValue withLabel={withLabel} fieldValue={fieldValue} data={data} />}
          </FormControl>
        ))}
    </Fragment>
  );
};
