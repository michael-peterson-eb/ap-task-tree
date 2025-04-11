import { Fragment, useEffect, useState, useRef } from "react";
import { FormInputProps } from "../../types/FormInputProps";
import { fetchAssessQuestionsByTemplateId } from "../../model/Questions";
import { fetchResponseOptionsByTemplateId } from "../../model/ResponseOptions";

import { FormControl, Select, InputLabel, TextField } from "@mui/material";

import DOMPurify from "dompurify";

import { getValue, getNameValue } from "../../utils/common";

import { setInnerHTML } from "../../utils/cleanup";

export const FormSingleSelect = (props: FormInputProps) => {
  const { fieldName, recordInfo, qtype, data, onChange, lookup, fnSecQA, fnReqField } = props;

  const [assessQuestions, setAssessQuestion] = useState([]);
  const [quesResponseOptions, setQuesResponseOptions] = useState([]);
  const [fieldValue, setFieldValue] = useState("");
  const aqAnswer = useRef(null);
  const templateId = data.id;

  useEffect(() => {
    const fetchQuestionsAndOptions = async () => {
      // query EA_SA_AssessmentQuestion
      const assessQuestions = await fetchAssessQuestionsByTemplateId(recordInfo, templateId);
      setAssessQuestion(assessQuestions);

      const responseOptions = await fetchResponseOptionsByTemplateId(templateId);

      const aqFieldValue = assessQuestions[0].EA_SA_rsAssessmentResponseOptions;
      const aqId = assessQuestions[0].id;
      const respValue = getValue(lookup, aqId, aqFieldValue);

      fnSecQA(templateId, templateId, respValue);
      setFieldValue(respValue);
      setQuesResponseOptions(responseOptions);
      aqAnswer.current = assessQuestions[0];
    };

    // call the function and catch any error
    fetchQuestionsAndOptions().catch(console.error);
  }, [templateId]);

  const cleanLabel = (htmlLabel: string) => {
    return DOMPurify.sanitize(htmlLabel, {
      USE_PROFILES: { html: true },
    });
  };

  return (
    <div>
      {assessQuestions.length > 0 &&
        assessQuestions.map((aq: any) => (
          <FormControl sx={{ width: "100%" }}>
            {recordInfo.crudAction == "edit" && (
              <Fragment>
                <InputLabel
                  id={`single-select-${aq.id}`}
                  size={"normal"}
                  sx={{ color: "#000", background: "#FFF", paddingRight: "4px", fontSize: "18px" }}
                  error={aq.EA_SA_rfRequiredQuestion && (fieldValue == "" || fieldValue == null)}
                >
                  {setInnerHTML(aq.name.trim())}
                </InputLabel>
                <Select
                  labelId={`single-select-${aq.id}`}
                  id={aq.id}
                  sx={{
                    width: "100%",
                    fontSize: "14px",
                  }}
                  name={fieldName}
                  onChange={(event: any) => {
                    const { id, name, value } = event.target;

                    let riskObj = null;
                    if (recordInfo.objectIntegrationName === "EA_RM_Risk") {
                      const foundResponseOption: any = quesResponseOptions.find((item: any) => item.id == value);
                      let next = {};

                      if (foundResponseOption) {
                        riskObj = { ...foundResponseOption, EA_SA_txtFieldIntegrationName: data.EA_SA_txtFieldIntegrationName };
                      }
                    }

                    setFieldValue(value);
                    onChange("SSP", event, aqAnswer.current, null, riskObj);
                    fnReqField();
                  }}
                  native
                  inputProps={{ readOnly: recordInfo.crudAction === "view" ? true : false }}
                  value={fieldValue}
                  required={data.EA_SA_cbRequiredQuestion == 1 ? true : false}
                >
                  <option aria-label="" value="">
                    Select option
                  </option>
                  {quesResponseOptions.length > 0 &&
                    quesResponseOptions.map((item: any) => {
                      return <option value={item.id}>{item.name}</option>;
                    })}
                </Select>
              </Fragment>
            )}
            {recordInfo.crudAction == "view" && (
              <TextField
                label={setInnerHTML(data.EA_SA_txtaQuestion)}
                value={getNameValue(quesResponseOptions, aq.EA_SA_rsAssessmentResponseOptions)}
                InputProps={{ readOnly: true }}
              />
            )}
          </FormControl>
        ))}
    </div>
  );
};
