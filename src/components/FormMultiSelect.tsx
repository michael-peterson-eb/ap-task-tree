import {useEffect, useState} from 'react';
import {
  unstable_useEnhancedEffect,
  TextField,
  Autocomplete,
  FormControl,
} from "@mui/material";
import { FormInputProps } from "./FormInputProps";

import {
  fetchResponseOptionsByTemplateId
} from "../model/ResponseOptions";

export const FormMultiSelect = ({recordInfo, qtype, data, onChange}: FormInputProps) => {
  const [questionsInterval, setQuestionsInterval] = useState([]);
  const [quesResponseOptions, setQuesResponseOptions] = useState([]);

  const templateId = data.id;
  useEffect(() => {
    // declare the async data fetching function
    const fetchQuestionsAndOptions = async () => {
      //const intervalQuestions = await fetchQuestionsIntervalsByTemplateId(recordInfo, data.id);
      //console.log("--fetchQuestionsIntervalsByTemplateId--", intervalQuestions)

      const responseOptions = await fetchResponseOptionsByTemplateId(templateId);
      console.log("--fetchQuestionsIntervalsByTemplateId:options--", responseOptions)

      //setQuestionsInterval(intervalQuestions);
      setQuesResponseOptions(responseOptions);
    }

    // call the function and catch any error
    fetchQuestionsAndOptions()
      .catch(console.error);

  }, [templateId])

  return (
    <Autocomplete
      sx={{ m: 1}}
      multiple
      options={responseOptions}
      getOptionLabel={(option) => option}
      disableCloseOnSelect
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={data.name}
          placeholder="Multiple Autocomplete"
        />
      )}
    />
  );
}