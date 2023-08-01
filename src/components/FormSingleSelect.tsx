import {useEffect, useState} from 'react';
import { FormInputProps } from "./FormInputProps";
import {
  fetchAssessQuestionsByTemplateId
} from "../model/Questions";
import {
  fetchResponseOptionsByTemplateId
} from "../model/ResponseOptions";

import {
    FormControl,
    Select,
    MenuItem,
    FormHelperText,
    InputLabel,
} from '@mui/material';

export const FormSingleSelect = ({recordInfo, qtype, data, onChange}: FormInputProps) => {
  const [assessQuestions, setAssessQuestion] = useState([]);
  const [quesResponseOptions, setQuesResponseOptions] = useState([]);

  const templateId = data.id;
  useEffect(() => {
    // declare the async data fetching function
    const fetchQuestionsAndOptions = async () => {
      const assessQuestions = await fetchAssessQuestionsByTemplateId(recordInfo, templateId);
      setAssessQuestion(assessQuestions);

      const responseOptions = await fetchResponseOptionsByTemplateId(templateId);
      console.log("--fetchQuestionsIntervalsByTemplateId:options--", responseOptions)

      setQuesResponseOptions(responseOptions);
    }

    // call the function and catch any error
    fetchQuestionsAndOptions()
      .catch(console.error);

  }, [templateId])
  return (
    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
      <InputLabel id="demo-simple-select-required-label">{data.EA_SA_txtaQuestion}</InputLabel>
      <Select
        labelId="demo-simple-select-required-label"
        id="demo-simple-select-required"
        value={data.value}
        label={data.EA_SA_txtaQuestion}
        onChange={onChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {data.items.map((item:any) => {
          return <MenuItem value={item.value}>{item.name}</MenuItem>
        })}
      </Select>
      <FormHelperText>Required</FormHelperText>
    </FormControl>
  );
};