import {useEffect, useState} from 'react';
import {
  TextField,
  Autocomplete,
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
  const [defaultValues, setDefaultValues] = useState([]);

  const templateId = data.id;
  useEffect(() => {
    // declare the async data fetching function
    const fetchQuestionsAndOptions = async () => {
      const assessQuestions = await fetchAssessQuestionsByTemplateId(recordInfo, templateId);
      setAssessQuestion(assessQuestions);

      const responseOptions = await fetchResponseOptionsByTemplateId(templateId);
      //console.log("--fetchQuestionsIntervalsByTemplateId:options--", responseOptions)

      setQuesResponseOptions(responseOptions);
    }

    // call the function and catch any error
    fetchQuestionsAndOptions()
      .catch(console.error);

  }, [templateId])

  const getDefaultValue = (options: any, stored: string) => {
    if ( stored == null ) return [];
    const matched = options.filter((opt: any) => {
      if (stored.indexOf(opt.id) >= 0 ) {
          return opt;
      }
    });
    return matched;
  };

  //console.log("--multiSelect:qtype--", qtype)
  //console.log("--multiSelect:data--", data)

  return (
    <div>
    {assessQuestions.length > 0 && assessQuestions.map((aq) => {
      const stringValues = aq.EA_SA_txtaResponse;
      const defaultValue = getDefaultValue(quesResponseOptions, stringValues);
      return (
        <Autocomplete
          sx={{ m: 1}}
          multiple
          id={aq.id}
          options={quesResponseOptions}
          value={defaultValue}
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
            onChange('MSP', event, {name: aq.id, value: newValue});
          }}
          onInputChange={(event, value) => {
            console.log("onInputChange---", value)
            setDefaultValues(value);
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