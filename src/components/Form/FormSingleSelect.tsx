import { FormControl, Select, InputLabel, MenuItem, Typography } from "@mui/material";
import { getNameValue, isQuestionRequired } from "../../utils/common";
import { setInnerHTML } from "../../utils/cleanup";
import { FormInputProps } from "../../types/FormInputProps";
import { ViewOnlyText } from "./ViewOnlyText";
import { Controller } from "react-hook-form";
import { RiskObj } from "../../types/ObjectTypes";

export const FormSingleSelect = ({ fieldName, appParams, assessmentQuestion, control, handleChange, hasLabel = true, questionTemplateData, responseOptions }: FormInputProps) => {
  const { EA_SA_txtFieldIntegrationName, EA_SA_txtaQuestion } = questionTemplateData;
  const { EA_SA_rfRequiredQuestion } = assessmentQuestion;
  const backendValue = assessmentQuestion[fieldName!];
  const required = isQuestionRequired(EA_SA_rfRequiredQuestion);
  const { crudAction: mode } = appParams;

  if (mode === "view") {
    return <ViewOnlyText label={hasLabel ? EA_SA_txtaQuestion : null} value={getNameValue(responseOptions, backendValue)} />;
  }

  if (mode === "edit") {
    return (
      <FormControl fullWidth>
        {hasLabel ? (
          <InputLabel id={`single-select-${assessmentQuestion.id}`} sx={{ paddingRight: "4px", paddingLeft: "4px", backgroundColor: "#FFF", fontSize: "16px" }}>
            {setInnerHTML(EA_SA_txtaQuestion)}
          </InputLabel>
        ) : null}
        <Controller
          control={control}
          defaultValue={backendValue}
          name={`${assessmentQuestion.id}.${fieldName}`}
          rules={{ required }}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <Select
                displayEmpty
                error={!!error}
                id={assessmentQuestion.id}
                labelId={`single-select-${assessmentQuestion.id}`}
                onChange={(event) => {
                  onChange(event);

                  const eventObj = { target: { id: assessmentQuestion.id, name: fieldName, value: event.target.value } };

                  if (appParams.objectIntegrationName === "EA_RM_Risk") {
                    const foundResponseOption = responseOptions.find((item) => item.id === event.target.value);

                    if (foundResponseOption) {
                      const riskObj: RiskObj = { ...foundResponseOption, EA_SA_txtFieldIntegrationName };
                      handleChange(eventObj, riskObj);
                    }
                  } else {
                    handleChange(eventObj, null);
                  }
                }}
                required={required}
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
