import { FormInputProps } from "../../types/FormInputProps";
import { FormControl, TextField, InputAdornment } from "@mui/material";
import { ViewOnlyText } from "./ViewOnlyText";
import { isQuestionRequired } from "../../utils/common";
import { setInnerHTML } from "../../utils/cleanup";
import { Controller } from "react-hook-form";
import { RiskObj } from "../../types/ObjectTypes";

export const FormInputCurrency = ({ fieldName, appParams, assessmentQuestion, control, handleChange, hasLabel = true, questionTemplateData }: FormInputProps) => {
  const { EA_SA_txtFieldIntegrationName, EA_SA_txtaQuestion } = questionTemplateData;
  const { EA_SA_rfRequiredQuestion } = assessmentQuestion;
  const backendValue = assessmentQuestion[fieldName!];
  const required = isQuestionRequired(EA_SA_rfRequiredQuestion);
  const { crudAction: mode } = appParams;

  if (mode === "view") {
    return <ViewOnlyText label={hasLabel ? EA_SA_txtaQuestion : null} value={backendValue} responseFormat="CCY" />;
  }

  if (mode === "edit") {
    return (
      <FormControl fullWidth variant="standard">
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
              InputProps={{
                startAdornment: <InputAdornment position="start">US$</InputAdornment>,
                inputMode: "numeric",
              }}
              label={hasLabel ? setInnerHTML(EA_SA_txtaQuestion) : null}
              name="Currency"
              onChange={(event) => {
                onChange(event);

                const eventObj = { target: { id: assessmentQuestion.id, name: fieldName, value: event.target.value } };

                if (appParams.objectIntegrationName === "EA_RM_Risk") {
                  const riskObj: RiskObj = { EA_SA_txtAssmtRespOptCode: event.target.value, EA_SA_txtFieldIntegrationName };
                  handleChange(eventObj, riskObj);
                } else {
                  handleChange(eventObj, null);
                }
              }}
              required={required}
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
