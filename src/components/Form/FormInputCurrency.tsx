import { FormInputProps } from "../../types/FormInputProps";
import {
  FormControl,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import { ViewOnlyText } from "./ViewOnlyText";
import { isQuestionRequired } from "../../utils/common";
import { setInnerHTML } from "../../utils/cleanup";
import { Controller } from "react-hook-form";
import { RiskObj } from "../../types/ObjectTypes";

export const FormInputCurrency = ({
  fieldName,
  appParams,
  assessmentQuestion,
  control,
  handleChange,
  hasLabel = true,
  questionTemplateData,
}: FormInputProps) => {
  const { EA_SA_txtFieldIntegrationName, EA_SA_txtaQuestion } =
    questionTemplateData;
  const { EA_SA_rfRequiredQuestion } = assessmentQuestion;
  const backendValue = assessmentQuestion[fieldName!];
  const required = isQuestionRequired(EA_SA_rfRequiredQuestion);
  const { crudAction: mode } = appParams;

  if (mode === "view") {
    return (
      <ViewOnlyText
        label={hasLabel ? EA_SA_txtaQuestion : null}
        value={backendValue}
        responseFormat="CCY"
        required={required}
      />
    );
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="7"
                      height="13"
                      viewBox="0 0 7 13"
                      fill="none"
                    >
                      <path
                        d="M5.08493 5.97031L2.45936 5.22969C2.15548 5.14531 1.94398 4.87109 1.94398 4.56641C1.94398 4.18438 2.26488 3.875 2.66114 3.875H4.27295C4.56954 3.875 4.86127 3.96172 5.10438 4.12109C5.25267 4.21719 5.45202 4.19375 5.57844 4.07422L6.42445 3.27734C6.59706 3.11562 6.57275 2.84609 6.38069 2.70312C5.78508 2.25312 5.04117 2.00234 4.27781 2V0.875C4.27781 0.66875 4.10277 0.5 3.88884 0.5H3.11089C2.89696 0.5 2.72192 0.66875 2.72192 0.875V2H2.66114C1.11255 2 -0.132164 3.28203 0.0112697 4.80313C0.113375 5.88359 0.969114 6.7625 2.04851 7.06719L4.54037 7.77031C4.84425 7.85703 5.05576 8.12891 5.05576 8.43359C5.05576 8.81563 4.73485 9.125 4.33859 9.125H2.72678C2.43019 9.125 2.13846 9.03828 1.89535 8.87891C1.74706 8.78281 1.54771 8.80625 1.42129 8.92578L0.57528 9.72266C0.402673 9.88437 0.426984 10.1539 0.619039 10.2969C1.21465 10.7469 1.95856 10.9977 2.72192 11V12.125C2.72192 12.3313 2.89696 12.5 3.11089 12.5H3.88884C4.10277 12.5 4.27781 12.3313 4.27781 12.125V10.9953C5.41069 10.9742 6.47307 10.325 6.84746 9.29141C7.37014 7.84766 6.49252 6.36641 5.08493 5.97031Z"
                        fill={!value || value === "" ? "#445A65" : "#1B2327"}
                      />
                    </svg>
                  </InputAdornment>
                ),
                inputMode: "numeric",
              }}
              name="Currency"
              onChange={(event) => {
                onChange(event);

                const eventObj = {
                  target: {
                    id: assessmentQuestion.id,
                    name: fieldName,
                    value: event.target.value,
                  },
                };

                if (appParams.objectIntegrationName === "EA_RM_Risk") {
                  const riskObj: RiskObj = {
                    EA_SA_txtAssmtRespOptCode: event.target.value,
                    EA_SA_txtFieldIntegrationName,
                  };
                  handleChange(eventObj, riskObj);
                } else {
                  handleChange(eventObj, null);
                }
              }}
              placeholder="Specify Amount"
              size="small"
              sx={styles}
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
