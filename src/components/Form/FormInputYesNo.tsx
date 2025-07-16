import { Select, MenuItem, Typography, FormControl } from "@mui/material";
import { getNameValue, isQuestionRequired } from "../../utils/common";
import { getQuestionHTML } from "../../utils/cleanup";
import { FormInputProps } from "../../types/FormInputProps";
import { ViewOnlyText } from "./ViewOnlyText";
import { Controller } from "react-hook-form";

export const FormYesNo = ({ fieldName, appParams, assessmentQuestion, control, handleChange, hasLabel = true, questionTemplateData, responseOptions }: FormInputProps) => {
  const { EA_SA_txtaQuestion } = questionTemplateData;
  const { EA_SA_rfRequiredQuestion, EA_SA_txtAdditionalInformation } = assessmentQuestion;
  let backendValue = assessmentQuestion[fieldName!];
  const required = isQuestionRequired(EA_SA_rfRequiredQuestion);
  const { crudAction: mode } = appParams;

  if (!backendValue) {
    backendValue = "";
  }

  if (mode === "view") {
    return <ViewOnlyText label={hasLabel ? EA_SA_txtaQuestion : null} value={getNameValue(responseOptions, backendValue)} required={required} />;
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
              display: "inline !important",
              wordBreak: "break-word",
              whiteSpace: "normal",
            }}
            component="span"
            dangerouslySetInnerHTML={{
              __html: getQuestionHTML(EA_SA_txtaQuestion, required),
            }}
          />
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
                MenuProps={{ sx: menuStyles }}
                notched
                onChange={(event: any) => {
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
                required={required}
                size="small"
                sx={styles}
                value={value}
              >
                <MenuItem aria-label="" value="">
                  <Typography sx={{ color: "#445A65" }}>{EA_SA_txtAdditionalInformation || "Select option"}</Typography>
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

const styles = {
  borderRadius: "4px",
  "& .MuiSelect-select": {
    paddingRight: "12px",
    paddingLeft: "12px",
    paddingTop: "8px",
    paddingBottom: "8px",
  },
  ".MuiOutlinedInput-notchedOutline": {
    border: "1px solid #CFD8DC",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #0042B6",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #0042B6",
  },
  ".MuiSvgIcon-root": {
    fill: "#1B2327 !important",
    borderLeft: "1px solid #CFD8DC",
    paddingLeft: "4px",
  },
  "&:hover .MuiSvgIcon-root": {
    fill: "#1B2327 !important",
    borderLeft: "1px solid #0042B6",
    paddingLeft: "4px",
  },
  "&.Mui-focused .MuiSvgIcon-root": {
    fill: "#1B2327 !important",
    borderLeft: "1px solid #0042B6",
    paddingLeft: "4px",
    transform: "rotateX(180deg)",
  },
  "& .rbs-validationMsg": {
    display: "none !important",
  },
};

const menuStyles = {
  ".MuiMenu-root": {},
  ".MuiMenu-paper": {
    marginTop: "4px",
    border: "1px solid #0042B6",
    borderRadius: "2px 0px 0px 2px",
  },
  ".MuiMenu-list": {
    padding: "0px",
  },
};
