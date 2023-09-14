import { useEffect, useState } from 'react';
import { FormInputProps } from "./FormInputProps";
import { TextField, FormControl } from '@mui/material';

import {
  fetchAssessQuestionsByTemplateId
} from "../model/Questions";

import { initSelectValue, getValue } from '../common/Utils';

const isRequired = (flag: any) => flag == 1;

export const FormInputText = ({ recordInfo, qtype, data, onChange, lookup }: FormInputProps) => {
  const [assessQuestions, setAssessQuestion] = useState([]);
  const [fieldValue, setFieldValue] = useState('');

  const templateId = data.id;

  useEffect(() => {
    const fetchQuestionsAndOptions = async () => {
      const assessQuestions = await fetchAssessQuestionsByTemplateId(recordInfo, templateId);
      setAssessQuestion(assessQuestions);

      if (assessQuestions && assessQuestions.length > 0) {
        const aqFieldValue = assessQuestions[0].EA_SA_txtaResponse;
        let responseValue = aqFieldValue ? aqFieldValue : '';
        const lookupValue = lookup(assessQuestions[0].id);

        if ( lookupValue || lookupValue == '' ) responseValue = lookupValue;
        const respValue = getValue(lookup, assessQuestions[0].id, aqFieldValue);

        setFieldValue(initSelectValue(recordInfo, respValue));
      }
    }

    fetchQuestionsAndOptions().catch(console.error);

  }, [templateId])

  return (
    <>
      {assessQuestions.length > 0 && assessQuestions.map((aq: any) => (
        <FormControl fullWidth sx={{ marginTop: 4 }} variant="standard">
          <TextField
            sx={{ m:0, "&:hover": { backgroundColor: "transparent" } }}
            required={isRequired(aq.EA_SA_rfRequiredQuestion)}
            id={data.id}
            label={data.EA_SA_txtaQuestion}
            name={aq.id}
            value={fieldValue}
            InputProps={{
              style: { fontSize: '14px' },
              ...recordInfo.crudAction == 'view' ? { readOnly: true } : { readOnly: false }
            }}
            InputLabelProps={{ style: { fontSize: '18px', backgroundColor: '#FFF' } }}
            onChange={(event: any) => {
              const { name, value } = event.target;
              setFieldValue(value);
              onChange('FRES', event);
            }}
            error={isRequired(aq.EA_SA_rfRequiredQuestion) && !fieldValue}
            helperText={isRequired(aq.EA_SA_rfRequiredQuestion) && !fieldValue ? "This question is required!" : ""}
          />
        </FormControl>
      ))}
    </>
  );
};