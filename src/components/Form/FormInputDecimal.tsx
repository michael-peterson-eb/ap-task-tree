import { FormInputProps } from "../../types/FormInputProps";
import { TextField, FormControl } from "@mui/material";
import { isQuestionRequired } from "../../utils/common";
import { setInnerHTML } from "../../utils/cleanup";
import { ViewOnlyText } from "./ViewOnlyText";
import { Controller } from "react-hook-form";

export const FormInputDecimal = ({ fieldName, appParams, assessmentQuestion, control, handleChange, hasLabel = true, questionTemplateData }: FormInputProps) => {
  const { EA_SA_txtaQuestion } = questionTemplateData;
  const { EA_SA_rfRequiredQuestion } = assessmentQuestion;
  const backendValue = assessmentQuestion[fieldName!];
  const required = isQuestionRequired(EA_SA_rfRequiredQuestion);
  const { crudAction: mode } = appParams;

  if (mode === "view") {
    return <ViewOnlyText label={hasLabel ? EA_SA_txtaQuestion : null} value={backendValue} />;
  }

  if (mode === "edit") {
    return (
      <FormControl fullWidth>
        <Controller
          control={control}
          defaultValue={backendValue}
          name={`${assessmentQuestion.id}.${fieldName}`}
          rules={{
            required,
            pattern: {
              value: /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/,
              message: "Please enter a decimal value",
            },
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              error={!!error}
              fullWidth
              helperText={!!error ? (error && error.message ? error.message : "This field is required") : null}
              inputProps={{ step: "0.1" }}
              InputProps={{ inputMode: "numeric" }}
              label={hasLabel ? setInnerHTML(EA_SA_txtaQuestion) : null}
              name="Decimal"
              onChange={(event) => {
                onChange(event);

                const eventObj = { target: { id: assessmentQuestion.id, name: fieldName, value: event.target.value } };

                handleChange(eventObj, null);
              }}
              type="number"
              variant="outlined"
              value={value}
            />
          )}
        />
      </FormControl>
    );
  }

  return null;
};
