import { TextField, FormControl, Typography } from "@mui/material";
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
    return (
      <ViewOnlyText
        label={hasLabel ? EA_SA_txtaQuestion : null}
        value={backendValue}
        size="small"
        required={required}
      />
    );
  }

  if (mode === "edit") {
    return (
      <FormControl fullWidth>
        {hasLabel ? (
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: 14,
              color: "#1B2327",
              paddingBottom: "4px",
            }}
          >
            {setInnerHTML(EA_SA_txtaQuestion)}{" "}
            {required && <span style={{ color: "red" }}>&nbsp;*</span>}
          </Typography>
        ) : null}
        <Controller
          control={control}
          defaultValue={backendValue}
          name={`${assessmentQuestion.id}.${fieldName}`}
          rules={{ required, minLength: 1 }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              error={!!error}
              fullWidth
              helperText={
                !!error
                  ? error && error.message
                    ? error.message
                    : "This field is required"
                  : null
              }
              inputProps={{
                style: {
                  color: !value || value === "" ? "#445A65" : "#1B2327",
                },
              }}
              name="Text"
              onChange={(event) => {
                onChange(event);

                const eventObj = {
                  target: {
                    id: assessmentQuestion.id,
                    name: fieldName,
                    value: event.target.value,
                  },
                };

                handleChange(eventObj, null);
              }}
              placeholder="Enter a response"
              required={required}
              size="small"
              sx={styles}
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
