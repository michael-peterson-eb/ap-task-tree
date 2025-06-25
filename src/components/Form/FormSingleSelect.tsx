import { FormControl, Select, MenuItem, Typography, Chip } from "@mui/material";
import { getNameValue, isQuestionRequired } from "../../utils/common";
import { getQuestionHTML } from "../../utils/cleanup";
import { FormInputProps } from "../../types/FormInputProps";
import { ViewOnlyText } from "./ViewOnlyText";
import { Controller } from "react-hook-form";
import { RiskObj } from "../../types/ObjectTypes";

export const FormSingleSelect = ({ fieldName, appParams, assessmentQuestion, control, handleChange, hasLabel = true, questionTemplateData, responseOptions }: FormInputProps) => {
  const { EA_SA_txtFieldIntegrationName, EA_SA_txtaQuestion } = questionTemplateData;
  const { EA_SA_rfRequiredQuestion, EA_SA_txtAdditionalInformation } = assessmentQuestion;
  let backendValue = assessmentQuestion[fieldName!];
  const required = isQuestionRequired(EA_SA_rfRequiredQuestion);
  const { crudAction: mode } = appParams;

  if (!backendValue) {
    backendValue = "";
  }

  if (mode === "view") {
    return (
      <ViewOnlyText
        label={hasLabel ? EA_SA_txtaQuestion : null}
        value={getNameValue(responseOptions, backendValue)}
        required={required}
        responseOptions={responseOptions}
        responseFormat="SSP"
      />
    );
  }

  if (mode === "edit") {
    return (
      <>
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
                      const foundResponseOption = responseOptions.find((item) => item.id === event.target.value);

                      if (foundResponseOption) {
                        const riskObj: RiskObj = {
                          ...foundResponseOption,
                          EA_SA_txtFieldIntegrationName,
                        };
                        handleChange(eventObj, riskObj);
                      }
                    } else {
                      handleChange(eventObj, null);
                    }
                  }}
                  required={required}
                  size="small"
                  sx={styles}
                  value={value}
                >
                  <MenuItem aria-label="" value="">
                    <Typography sx={{ color: "#445A65", fontSize: 14 }}>{EA_SA_txtAdditionalInformation || "Select option"}</Typography>
                  </MenuItem>
                  {responseOptions.length > 0 &&
                    responseOptions.map((responseOption: any) => {
                      return (
                        <MenuItem value={responseOption.id}>
                          <Typography sx={{ display: "flex", alignItems: "center", gap: "8px", fontSize: 14 }}>
                            <Chip label="" size="small" sx={{ ...chipStyles, backgroundColor: responseOption.EA_SA_txtLabelColor || chipStyles.backgroundColor }} />
                            {responseOption.name}
                          </Typography>
                        </MenuItem>
                      );
                    })}
                </Select>
              );
            }}
          />
        </FormControl>
      </>
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
  "& .rbs-validationMsg": {
    display: "none !important",
  },
};

const chipStyles = {
  backgroundColor: "#000", // Default color
  width: "14px",
  height: "14px",
  borderRadius: "2px",
  border: "1px solid rgba(0, 0, 0, 0.60)",
};
