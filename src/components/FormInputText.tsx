import {useEffect, useState} from 'react';
import { FormInputProps } from "./FormInputProps";
import { TextField, FormControl } from '@mui/material';

import {
  fetchAssessQuestionsByTemplateId
} from "../model/Questions";

export const FormInputText = ({ recordInfo, qtype, data, onChange}: FormInputProps) => {

  const [assessQuestions, setAssessQuestion] = useState([]);
  const templateId = data.id;

  useEffect(() => {
    // declare the async data fetching function
    const fetchQuestionsAndOptions = async () => {
      const assessQuestions = await fetchAssessQuestionsByTemplateId(recordInfo, templateId);
      setAssessQuestion(assessQuestions);
    }

    // call the function and catch any error
    fetchQuestionsAndOptions()
      .catch(console.error);

  }, [templateId])

  return (
    <div>
      {assessQuestions.length > 0 && assessQuestions.map((aq: any) => {
        return (
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
            <TextField
              sx={{ m: 1 }}
              required={ data.EA_SA_cbRequiredQuestion == 0}
              helperText={data.EA_SA_txtaHelpText}
              id={aq.id}
              label={data.EA_SA_txtaQuestion}
              name={aq.id}
              value={aq.EA_SA_txtaResponse}
              onChange={(event: any) => {
                onChange('FRES', event);
              }}
              />
          </FormControl>
        )
      })}
    </div>
  );
};