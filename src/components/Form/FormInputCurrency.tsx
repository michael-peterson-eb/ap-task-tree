import { FormInputProps } from "../../types/FormInputProps";
import { FormControl, TextField, InputAdornment } from "@mui/material";
import { ViewOnlyText } from "./ViewOnlyText";
import { isQuestionRequired } from "../../utils/common";
import { setInnerHTML } from "../../utils/cleanup";
import { Controller } from "react-hook-form";
import { ChangeObj } from "../../types/ObjectTypes";

export const FormInputCurrency = ({
  fieldName,
  appParams,
  assessmentQuestion,
  control,
  handleChange,
  hasLabel = true,
  questionTemplateData,
  scope = "EA_OR_NORMAL",
}: FormInputProps) => {
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
          render={({ field: { onChange, value }, fieldState: { invalid, error } }) => (
            <TextField
              error={!!invalid}
              fullWidth
              helperText={!!invalid ? (error && error.message ? error.message : "This field is required") : null}
              InputProps={{
                startAdornment: <InputAdornment position="start">US$</InputAdornment>,
                inputMode: "numeric",
              }}
              label={hasLabel ? setInnerHTML(EA_SA_txtaQuestion) : null}
              onChange={(event) => {
                onChange(event);

                const eventObj = { target: { id: assessmentQuestion.id, name: fieldName, value: event.target.value } };
                const changeObj: ChangeObj = { responseFormat: "CCY", scope };

                if (appParams.objectIntegrationName === "EA_RM_Risk") {
                  changeObj.riskObj = { EA_SA_txtAssmtRespOptCode: event.target.value, EA_SA_txtFieldIntegrationName };
                }

                handleChange(eventObj, changeObj);
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
