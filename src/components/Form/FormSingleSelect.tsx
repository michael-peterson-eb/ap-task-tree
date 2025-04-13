import { Fragment, useState } from "react";
import { FormControl, Select, InputLabel, TextField } from "@mui/material";
import { getNameValue, getDefaultValue } from "../../utils/common";
import { setInnerHTML } from "../../utils/cleanup";

export const FormSingleSelect = ({ fieldName, appParams, assessmentQuestion, assessmentQuestionResponseOptions, onChange, questionTemplateData, questionUpdates }) => {
  const { EA_SA_cbRequiredQuestion } = questionTemplateData;
  const { crudAction: mode } = appParams;

  const defaultValue = getDefaultValue({
    objToCheck: questionUpdates.current,
    idToMatch: assessmentQuestion.id,
    backendValue: assessmentQuestion.EA_SA_rsAssessmentResponseOptions,
    fallbackValue: "",
  });

  const [value, setValue] = useState(defaultValue);

  if (mode === "view") {
    return (
      <FormControl sx={{ width: "100%" }}>
        <TextField
          label={setInnerHTML(questionTemplateData.EA_SA_txtaQuestion)}
          value={getNameValue(assessmentQuestionResponseOptions, assessmentQuestion.EA_SA_rsAssessmentResponseOptions)}
          InputProps={{ readOnly: true }}
        />
      </FormControl>
    );
  }

  if (mode === "edit") {
    return (
      <FormControl sx={{ width: "100%" }}>
        <Fragment>
          <InputLabel
            id={`single-select-${assessmentQuestion.id}`}
            size={"normal"}
            sx={{ color: "#000", background: "#FFF", paddingRight: "4px", fontSize: "18px" }}
            error={assessmentQuestion.EA_SA_rfRequiredQuestion && (value == "" || value == null)}
          >
            {setInnerHTML(assessmentQuestion.name.trim())}
          </InputLabel>
          <Select
            labelId={`single-select-${assessmentQuestion.id}`}
            id={assessmentQuestion.id}
            sx={{ width: "100%", fontSize: "14px" }}
            name={fieldName}
            onChange={(event: any) => {
              const { value } = event.target;

              let riskObj = null;
              if (appParams.objectIntegrationName === "EA_RM_Risk") {
                const foundResponseOption: any = assessmentQuestionResponseOptions.find((item: any) => item.id == value);

                if (foundResponseOption) {
                  riskObj = { ...foundResponseOption, EA_SA_txtFieldIntegrationName: questionTemplateData.EA_SA_txtFieldIntegrationName };
                }
              }

              setValue(value);
              onChange(event, { assessmentQuestionId: assessmentQuestion.id, responseFormat: "SSP", riskObj });
            }}
            native
            value={value}
            required={EA_SA_cbRequiredQuestion == 1 ? true : false}
          >
            <option aria-label="" value="">
              Select option
            </option>
            {assessmentQuestionResponseOptions.length > 0 &&
              assessmentQuestionResponseOptions.map((responseOption: any) => {
                return <option value={responseOption.id}>{responseOption.name}</option>;
              })}
          </Select>
        </Fragment>
      </FormControl>
    );
  }

  return null;
};
