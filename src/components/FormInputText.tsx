import { useEffect, useState } from 'react';
import { FormInputProps } from "./FormInputProps";
import { TextField, FormControl } from '@mui/material';

import {
  fetchAssessQuestionsByTemplateId
} from "../model/Questions";

export const FormInputText = ({ recordInfo, qtype, data, onChange }: FormInputProps) => {

  const [assessQuestions, setAssessQuestion] = useState([]);
  const [fieldValue, setFieldValue] = useState(data.EA_SA_txtaResponse);

  const templateId = data.id;

  useEffect(() => {
    // declare the async data fetching function
    const fetchQuestionsAndOptions = async () => {
      const assessQuestions = await fetchAssessQuestionsByTemplateId(recordInfo, templateId);
      setAssessQuestion(assessQuestions);

      if (assessQuestions && assessQuestions.length > 0) {
        const fieldValue = assessQuestions[0].EA_SA_txtaResponse;
        setFieldValue(fieldValue);
      }
    }

    // call the function and catch any error
    fetchQuestionsAndOptions()
      .catch(console.error);

  }, [templateId])

  return (
    <>
      {assessQuestions.length > 0 && assessQuestions.map((aq: any) => (
        <FormControl fullWidth sx={{ marginTop: '12px' }} variant="standard">
          <TextField
            sx={{ m: 0 }}
            required={data.EA_SA_cbRequiredQuestion == 0}
            helperText={data.EA_SA_txtaHelpText}
            id={aq.id}
            label={data.EA_SA_txtaQuestion}
            name={aq.id}
            value={fieldValue}
            InputProps={recordInfo.crudAction == 'view' ? { readOnly: true } : { readOnly: false }}
            onChange={(event: any) => {
              const { name, value } = event.target;
              setFieldValue(value);
              onChange('FRES', event);
            }}
          />
        </FormControl>
      ))}
    </>
  );
};