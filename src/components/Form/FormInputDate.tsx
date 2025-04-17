import { FormInputProps } from "../../types/FormInputProps";
import { FormControl, ThemeProvider } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { isQuestionRequired, isValidDate } from "../../utils/common";
import { dateYYYYMMDDFormat } from "../../utils/format";
import { isDateInFuture } from "../../utils/common";
import dayjs from "dayjs";
import { ViewOnlyText } from "./ViewOnlyText";
import { setInnerHTML } from "../../utils/cleanup";
import { Controller } from "react-hook-form";

export const FormInputDate = ({ fieldName, appParams, assessmentQuestion, control, handleChange, hasLabel = true, questionTemplateData }: FormInputProps) => {
  const { EA_SA_txtaQuestion } = questionTemplateData;
  const { EA_SA_rfRequiredQuestion } = assessmentQuestion;
  const backendValue = assessmentQuestion[fieldName!];
  const required = isQuestionRequired(EA_SA_rfRequiredQuestion);
  const { crudAction: mode } = appParams;

  if (mode === "view") {
    return <ViewOnlyText label={hasLabel ? EA_SA_txtaQuestion : null} value={dayjs(backendValue)} responseFormat="DATE" />;
  }

  if (mode === "edit") {
    return (
        <FormControl fullWidth variant="standard">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              control={control}
              defaultValue={dayjs(backendValue)}
              name={`${assessmentQuestion.id}.${fieldName}`}
              rules={{
                required,
                validate: { isDateInFuture },
              }}
              render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                <DatePicker
                  disablePast={true}
                  inputRef={ref}
                  label={hasLabel ? setInnerHTML(EA_SA_txtaQuestion) : null}
                  onChange={(newValue) => {
                    onChange(newValue);

                    const formattedDate = dateYYYYMMDDFormat(newValue);

                    if (isValidDate(formattedDate) && isDateInFuture(newValue)) {
                      const eventObj = { target: { id: assessmentQuestion.id, name: fieldName, value: formattedDate } };

                      handleChange(eventObj, null);
                    }
                  }}
                  slotProps={{
                    actionBar: {
                      actions: ["clear"],
                    },
                    textField: {
                      required,
                      helperText: !!error ? (error && error.message ? error.message : "Please enter a valid date") : null,
                      error: !!error,
                    },
                  }}
                  value={value}
                />
              )}
            />
          </LocalizationProvider>
        </FormControl>
    );
  }

  return null;
};
