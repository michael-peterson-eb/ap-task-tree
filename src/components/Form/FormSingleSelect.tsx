import { FormControl, Select, InputLabel, MenuItem, Typography } from "@mui/material";
import { getNameValue, isQuestionRequired } from "../../utils/common";
import { setInnerHTML } from "../../utils/cleanup";
import { FormInputProps } from "../../types/FormInputProps";
import { ViewOnlyText } from "./ViewOnlyText";
import { Controller } from "react-hook-form";
import { ChangeObj } from "../../types/ObjectTypes";

export const FormSingleSelect = ({ fieldName, appParams, assessmentQuestion, control, handleChange, hasLabel = true, questionTemplateData, responseOptions, questionUpdates, scope = "EA_OR_NORMAL" }: FormInputProps) => {
  const { EA_SA_txtFieldIntegrationName, EA_SA_txtaQuestion } = questionTemplateData;
  const { EA_SA_rfRequiredQuestion } = assessmentQuestion;
  const backendValue = assessmentQuestion[fieldName!];
  const required = isQuestionRequired(EA_SA_rfRequiredQuestion);
  const { crudAction: mode } = appParams;

  console.log('ASSESSMENT QUESTION', assessmentQuestion); 
  console.log('FIELD NAME', fieldName);

  console.log('BACKEND VALUE', fieldName, backendValue);
  console.log('RESPONSE OPTIONS', responseOptions);

  if (mode === "view") {
    return <ViewOnlyText label={hasLabel ? EA_SA_txtaQuestion : null} value={getNameValue(responseOptions, backendValue)} />;
  }

  if (mode === "edit") {
    return (
      <FormControl fullWidth>
        {hasLabel ? (
          <InputLabel id={`single-select-${assessmentQuestion.id}`} sx={{ color: "#000", background: "#FFF", paddingRight: "4px", fontSize: "18px" }}>
            {setInnerHTML(EA_SA_txtaQuestion)}
          </InputLabel>
        ) : null}
        <Controller
          control={control}
          defaultValue={backendValue}
          name={`${assessmentQuestion.id}.${fieldName}`}
          rules={{ required }}
          render={({ field: { onChange, value }, fieldState: { invalid } }) => {
            return (
              <Select
                displayEmpty
                error={!!invalid}
                id={assessmentQuestion.id}
                labelId={`single-select-${assessmentQuestion.id}`}
                onChange={(event) => {
                  onChange(event);

                  const eventObj = { target: { id: assessmentQuestion.id, name: fieldName, value: event.target.value } };
                  const changeObj: ChangeObj = { responseFormat: "SSP", scope };

                  if (appParams.objectIntegrationName === "EA_RM_Risk") {
                    const foundResponseOption = responseOptions.find((item) => item.id == event.target.value);

                    if (foundResponseOption) {
                      changeObj.riskObj = { ...foundResponseOption, EA_SA_txtFieldIntegrationName };
                    }
                  }

                  handleChange(eventObj, changeObj);
                }}
                required={required}
                sx={{ width: "100%", fontSize: "14px" }}
                value={value}
              >
                <MenuItem aria-label="" value="">
                  <em>Select option</em>
                </MenuItem>
                {responseOptions.length > 0 &&
                  responseOptions.map((responseOption: any) => {
                    return (
                      <MenuItem value={responseOption.id}>
                        <Typography>{responseOption.name}</Typography>
                      </MenuItem>
                    );
                  })}
              </Select>
            );
          }}
        />
      </FormControl>
    );
  }

  return null;
};
