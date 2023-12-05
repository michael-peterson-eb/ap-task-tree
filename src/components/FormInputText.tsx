import { useEffect, useState } from 'react';
import { FormInputProps } from "./FormInputProps";
import { TextField, FormControl } from '@mui/material';

import {
  fetchAssessQuestionsByTemplateId
} from "../model/Questions";

import { initSelectValue, getValue, appendQuestions } from '../common/Utils';

export const FormInputText = (props: FormInputProps) => {
  const {recordInfo, qtype, data, onChange, lookup, fnSecQA, fnReqField} = props;

  const [assessQuestions, setAssessQuestion] = useState([]);
  const [fieldValue, setFieldValue] = useState('');

  const templateId = data.id;

  const isQuestionRequired = (flag:any) => {
    return flag == 1;
  }

  const requiredColor = () => {
    return isQuestionRequired(data.EA_SA_rfRequiredQuestion) ? "#d32f2f" : "#000"
  }

  useEffect(() => {
    const fetchQuestionsAndOptions = async () => {
      const assessQuestions = await fetchAssessQuestionsByTemplateId(recordInfo, templateId);
      setAssessQuestion(assessQuestions);

      if (assessQuestions && assessQuestions.length > 0) {
        const aqId = assessQuestions[0].id;
        const aqFieldValue = assessQuestions[0].EA_SA_txtaResponse;
        const lookupValue = lookup(aqId);

        let responseValue = aqFieldValue ? aqFieldValue : '';
        if ( lookupValue || lookupValue == '' ) responseValue = lookupValue;

        const respValue = getValue(lookup, aqId, aqFieldValue);
        const newValue = initSelectValue(recordInfo, respValue);
        setFieldValue(newValue);

        //fnSecQs(assessQuestions); // track section question states

        //if (recordInfo.crudAction === "edit" ) fnSecQA(templateId, aqId, newValue);
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
            required={isQuestionRequired(aq.EA_SA_rfRequiredQuestion)}
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
              fnReqField();
            }}
            error={isQuestionRequired(aq.EA_SA_rfRequiredQuestion) && !fieldValue}
            helperText={isQuestionRequired(aq.EA_SA_rfRequiredQuestion) && !fieldValue ? "This question is required!" : ""}
          />
        </FormControl>
      ))}
    </>
  );
};