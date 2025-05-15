import { FormInputProps } from "../../types/FormInputProps";
import { TextField, Autocomplete, FormControl, FormGroup, MenuItem, Checkbox, ListItemText, Typography, Chip } from "@mui/material";
import { getMultiValue, isQuestionRequired, getDefaultMultiValue } from "../../utils/common";
import { ViewOnlyText } from "./ViewOnlyText";
import { Controller } from "react-hook-form";
import { setInnerHTML } from "../../utils/cleanup";

export const FormMultiSelect = ({ fieldName, appParams, assessmentQuestion, control, handleChange, questionTemplateData, responseOptions }: FormInputProps) => {
  const { EA_SA_txtaQuestion, EA_SA_ddlResponseFormat: responseFormat } = questionTemplateData;
  const { EA_SA_rfRequiredQuestion, EA_SA_txtaResponse } = assessmentQuestion;
  const backendValue = assessmentQuestion[fieldName!];
  const required = isQuestionRequired(EA_SA_rfRequiredQuestion);
  const { crudAction: mode } = appParams;

  if (mode === "view") {
    return <ViewOnlyText label={EA_SA_txtaQuestion} value={getMultiValue(responseOptions, EA_SA_txtaResponse)} required={required} responseFormat={responseFormat} />;
  }

  if (mode === "edit") {
    // Find the relevant response option
    const selectedOption = null // responseOptions?.find((option) => option.name === value);

    const chipColor = selectedOption?.EA_SA_txtLabelColor || "#000000"; // Default to black if no color is found
    return (
      <FormControl sx={{ width: "100%" }} required={required}>
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
        <FormGroup sx={{ paddingTop: 1 }}>
          <Controller
            control={control}
            defaultValue={getDefaultMultiValue(backendValue, responseOptions)}
            name={`${assessmentQuestion.id}.${fieldName}`}
            rules={{ required: true, minLength: 1 }}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <Autocomplete
                  ChipProps={{ style: { borderRadius: "4px" } }}
                  defaultValue={value}
                  disableCloseOnSelect
                  getOptionLabel={(option: any) => option.name}
                  ListboxProps={{ style: { padding: "0px" } }}
                  multiple
                  noOptionsText="No options available"
                  onChange={(event, newValue: any) => {
                    onChange(newValue);

                    const idsOnly = newValue.map((item) => item.id).join(",");
                    const eventObj = {
                      target: {
                        id: assessmentQuestion.id,
                        name: fieldName,
                        value: idsOnly,
                      },
                    };

                    handleChange(eventObj, null);
                  }}
                  options={responseOptions!}
                  renderOption={(props, option: any, { selected }) => {
                    const { key, ...optionProps } = props;
                    return (
                      <li key={key} {...optionProps}>
                        <Checkbox style={{ marginRight: 8 }} checked={selected} />
                        <Chip label="" sx={{ ...chipStyles, backgroundColor: option.EA_SA_txtLabelColor || chipStyles.backgroundColor}} />
                        {option.name}
                      </li>
                    );
                  }}
                  renderInput={(params) => <TextField {...params} placeholder={value.length > 0 ? "" : "Select options"} />}
                  /* renderValue={(value: string[], getItemProps) =>
                    value.map((option: string, index: number) => {
                      const { key, ...itemProps } = getItemProps({ index });
                      return (
                        <Chip variant="outlined" label={option} key={key} {...itemProps} />
                      );
                    })
                  } */
                  size="small"
                  slotProps={{
                    paper: {
                      style: {
                        marginTop: "4px",
                        border: "1px solid #0042B6",
                        borderRadius: "2px 0px 0px 2px",
                      },
                    },
                  }}
                  sx={styles}
                />
              );
            }}
          />
        </FormGroup>
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

const chipStyles = {
  backgroundColor: "#ccc", // Default color
  width: "14px",
  height: "14px",
  borderRadius: "2px",
  marginRight: "8px",
};