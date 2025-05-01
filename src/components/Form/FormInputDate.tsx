import { FormInputProps } from "../../types/FormInputProps";
import { FormControl, Typography } from "@mui/material";
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
        {hasLabel ? (
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: 14,
              color: "#1B2327",
              paddingBottom: "4px",
            }}
          >
            {setInnerHTML(EA_SA_txtaQuestion)} {required && <span style={{ color: "red" }}>&nbsp;*</span>}
          </Typography>
        ) : null}
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
                onChange={(newValue) => {
                  onChange(newValue);

                  const formattedDate = dateYYYYMMDDFormat(newValue);

                  if (isValidDate(formattedDate) && isDateInFuture(newValue)) {
                    const eventObj = {
                      target: {
                        id: assessmentQuestion.id,
                        name: fieldName,
                        value: formattedDate,
                      },
                    };

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
                    inputProps: {
                      style: {
                        color: !value || value === "" ? "#445A65" : "#1B2327",
                      },
                    },
                  },
                }}
                sx={styles}
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

const styles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: "4px",
      border: "1px solid #CFD8DC",
    },
    "&:hover fieldset": {
      border: "1px solid #0042B6",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid #0042B6",
    },
  },
};
