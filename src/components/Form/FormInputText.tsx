import { TextField, FormControl } from "@mui/material";
import { isQuestionRequired } from "../../utils/common";
import { setInnerHTML } from "../../utils/cleanup";
import { ViewOnlyText } from "./ViewOnlyText";
import { FormInputProps } from "../../types/FormInputProps";
import { Controller } from "react-hook-form";

export const FormInputText = ({
  fieldName,
  appParams,
  assessmentQuestion,
  control,
  hasLabel = true,
  handleChange,
  questionTemplateData,
}: FormInputProps) => {
  const { EA_SA_txtaQuestion } = questionTemplateData;
  const { EA_SA_rfRequiredQuestion } = assessmentQuestion;
  const backendValue = assessmentQuestion[fieldName!];
  const required = isQuestionRequired(EA_SA_rfRequiredQuestion);
  const { crudAction: mode } = appParams;

  if (mode === "view") {
    return <ViewOnlyText label={hasLabel ? EA_SA_txtaQuestion : null} value={backendValue} size="small" />;
  }

  if (mode === "edit") {
    return (
      <FormControl fullWidth>
        <Controller
          control={control}
          defaultValue={backendValue}
          name={`${assessmentQuestion.id}.${fieldName}`}
          rules={{ required, minLength: 1 }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              error={!!error}
              fullWidth
              helperText={!!error ? (error && error.message ? error.message : "This field is required") : null}
              label={hasLabel ? setInnerHTML(EA_SA_txtaQuestion) : null}
              name="Text"
              onChange={(event) => {
                onChange(event);

                const eventObj = { target: { id: assessmentQuestion.id, name: fieldName, value: event.target.value } };

                handleChange(eventObj, null);
              }}
              required={required}
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
