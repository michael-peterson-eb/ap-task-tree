import { TextField, Autocomplete, FormControl, FormGroup } from "@mui/material";
import { FormInputProps } from "../../types/FormInputProps";
import { getMultiValue, isQuestionRequired, getDefaultMultiValue } from "../../utils/common";
import { ViewOnlyText } from "./ViewOnlyText";
import { Controller } from "react-hook-form";

export const FormMultiSelect = ({ fieldName, appParams, assessmentQuestion, control, handleChange, hasLabel = true, questionTemplateData, responseOptions }: FormInputProps) => {
  const { EA_SA_txtaQuestion } = questionTemplateData;
  const { EA_SA_rfRequiredQuestion, EA_SA_txtaResponse } = assessmentQuestion;
  const backendValue = assessmentQuestion[fieldName!];
  const required = isQuestionRequired(EA_SA_rfRequiredQuestion);
  const { crudAction: mode } = appParams;

  if (mode === "view") {
    return <ViewOnlyText label={EA_SA_txtaQuestion} value={getMultiValue(responseOptions, EA_SA_txtaResponse)} />;
  }

  if (mode === "edit") {
    return (
      <FormControl sx={{ width: "100%" }} required={required}>
        <FormGroup sx={{ paddingTop: 1 }}>
          <Controller
            control={control}
            defaultValue={getDefaultMultiValue(backendValue, responseOptions)}
            name={`${assessmentQuestion.id}.${fieldName}`}
            rules={{ required: true, minLength: 1 }}
            render={({ field: { onChange, value }, fieldState: { invalid, error } }) => {
              return (
                <Autocomplete
                  disableCloseOnSelect
                  getOptionLabel={(option: any) => option.name}
                  multiple
                  onChange={(event, newValue) => {
                    onChange(newValue);

                    const idsOnly = newValue.map((item) => item.id).join(",");
                    const eventObj = { target: { id: assessmentQuestion.id, name: fieldName, value: idsOnly } };
                    const changeObj = { assessmentQuestionId: assessmentQuestion.id, responseFormat: "MSP" };

                    handleChange(eventObj, changeObj);
                  }}
                  options={responseOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name={fieldName}
                      id={assessmentQuestion.id}
                      label={assessmentQuestion.name}
                      error={!!invalid}
                      helperText={!!invalid ? (error && error.message ? error.message : "This field is required") : null}
                    />
                  )}
                  renderOption={(props, option: any) => {
                    return (
                      <li {...props} key={option.id}>
                        {option.name}
                      </li>
                    );
                  }}
                  value={value}
                />
              );
            }}
          />
        </FormGroup>
      </FormControl>
    );
  }

  return null;
};
