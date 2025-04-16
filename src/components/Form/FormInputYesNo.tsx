import { Select, InputLabel, MenuItem, Typography, FormControl } from "@mui/material";
import { getNameValue, isQuestionRequired } from "../../utils/common";
import { setInnerHTML } from "../../utils/cleanup";
import { FormInputProps } from "../../types/FormInputProps";
import { ViewOnlyText } from "./ViewOnlyText";
import { Controller } from "react-hook-form";

export const FormYesNo = ({
  fieldName,
  appParams,
  assessmentQuestion,
  control,
  handleChange,
  hasLabel = true,
  questionTemplateData,
  responseOptions,
  scope = "EA_OR_NORMAL",
}: FormInputProps) => {
  const { EA_SA_txtaQuestion } = questionTemplateData;
  const { EA_SA_rfRequiredQuestion } = assessmentQuestion;
  const backendValue = assessmentQuestion[fieldName!];
  const required = isQuestionRequired(EA_SA_rfRequiredQuestion);
  const { crudAction: mode } = appParams;

  if (mode === "view") {
    return <ViewOnlyText label={hasLabel ? EA_SA_txtaQuestion : null} value={getNameValue(responseOptions, backendValue)} />;
  }

  if (mode === "edit") {
    return (
      <FormControl fullWidth>
        {hasLabel ? (
          <InputLabel id={`yesno-${assessmentQuestion.id}`} size="normal" sx={{ background: "#FFF", paddingRight: "4px", fontSize: "18px" }}>
            {setInnerHTML(EA_SA_txtaQuestion)}
          </InputLabel>
        ) : null}
        <Controller
          control={control}
          defaultValue={backendValue}
          name={`${assessmentQuestion.id}.${fieldName}`}
          rules={{ required: true }}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            return (
              <Select
                displayEmpty
                error={!!error}
                id={assessmentQuestion.id}
                labelId={`yesno-${assessmentQuestion.id}`}
                onChange={(event: any) => {
                  onChange(event);

                  const eventObj = { target: { id: assessmentQuestion.id, name: fieldName, value: event.target.value } };
                  const changeObj: any = { responseFormat: "SSP", scope };

                  handleChange(eventObj, changeObj);
                }}
                required={required}
                sx={{ width: "100%", fontSize: "14px" }}
                value={value}
              >
                <MenuItem aria-label="" value="">
                  <Typography>Select option</Typography>
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
