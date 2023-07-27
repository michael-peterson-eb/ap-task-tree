import {useEffect, useState} from 'react';
import {
  TextField,
  Autocomplete,
  FormControl,
} from "@mui/material";
import { FormInputProps } from "./FormInputProps";
import {
  fetchAssessQuestionsByTemplateId
} from "../model/Questions";
import {
  fetchResponseOptionsByTemplateId
} from "../model/ResponseOptions";

export const FormMultiSelect = ({recordInfo, qtype, data, onChange}: FormInputProps) => {
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

  const setValue = (val) => {
    console.log("--setValue--", val)
  }

  const defaultValue = [
    {id: 136198002, name:"1st Weelkkk"},
    {id: 136198003, name:"2nd Weelkkk"},
  ]
  console.log("--multiSelect:qtype--", qtype)
  console.log("--multiSelect:data--", data)

  return (
    <div>
    {assessQuestions.length > 0 && assessQuestions.map((aq) => {
      return (
        <Autocomplete
          sx={{ m: 1}}
          multiple
          id={aq.id}
          options={quesResponseOptions}
          defaultValue={defaultValue}
          //getOptionSelected={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.name}
          disableCloseOnSelect
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.id}>
                {option.name}
              </li>
            );
          }}
          onChange={(event: any, newValue: any | null) => {
            onChange(event, {name: aq.id, value: newValue});
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              name={aq.id}
              label={aq.name}
            />
          )}
        />
      )
    })}
    </div>
  );
}