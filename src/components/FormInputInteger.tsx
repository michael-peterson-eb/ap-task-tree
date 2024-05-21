import { useEffect, useState } from 'react';
import { FormInputProps } from "./FormInputProps";
import { TextField, FormControl } from '@mui/material';

import {
  fetchAssessQuestionsByTemplateId
} from "../model/Questions";

import {
    initSelectValue,
    getValue,
    cleanLabel
} from '../common/Utils';

export const FormInputInteger = (props: FormInputProps) => {
  const {recordInfo, qtype, data, onChange, lookup, fnSecQA, fnReqField} = props;

  const [assessQuestions, setAssessQuestion] = useState([]);
  const [fieldValue, setFieldValue] = useState('');

  const templateId = data.id;

  const isQuestionRequired = (flag:any) => flag == 1;

  const requiredColor = () => isQuestionRequired(data.EA_SA_rfRequiredQuestion) ? "#d32f2f" : "#000"

  const fieldLabel = (text: string) => {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: cleanLabel(text),
        }}
      />
    );
  };

  useEffect(() => {
    const fetchQuestionsAndOptions = async () => {
      const assessQuestions = await fetchAssessQuestionsByTemplateId(recordInfo, templateId);
      setAssessQuestion(assessQuestions);

      if (assessQuestions && assessQuestions.length > 0) {
        const aqId = assessQuestions[0].id;
        const aqFieldValue = assessQuestions[0].EA_SA_intResponse;
        const lookupValue = lookup(aqId);

        let responseValue = aqFieldValue ? aqFieldValue : '';
        if ( lookupValue || lookupValue == '' ) responseValue = lookupValue;

        const respValue = getValue(lookup, aqId, aqFieldValue);
        const newValue = initSelectValue(recordInfo, respValue);
        setFieldValue(newValue);

      }
    }
    fetchQuestionsAndOptions().catch(console.error);

  }, [templateId])

  return (
    <>
      {assessQuestions.length > 0 && assessQuestions.map((aq: any) => (
        <FormControl fullWidth sx={{ marginTop: 4 }} variant="standard">
          {recordInfo.crudAction == "edit" &&
            <TextField
              sx={{ m:0, "&:hover": { backgroundColor: "transparent" } }}
              required={isQuestionRequired(aq.EA_SA_rfRequiredQuestion)}
              id={data.id}
              label={data.EA_SA_txtaQuestion}
              name={'EA_SA_intResponse'}
              value={fieldValue}
              type="number"
              InputProps={{
                inputMode: 'numeric',
                style: { fontSize: '14px' },
                ...recordInfo.crudAction == 'view' ? { readOnly: true } : { readOnly: false }
              }}
              InputLabelProps={{ style: { fontSize: '18px', backgroundColor: '#FFF' } }}
              onChange={(event: any) => {
                const { id, name, value } = event.target;
                setFieldValue(value);
                onChange('INT', null, {id: id, name: name, value: value});
                fnReqField();
              }}
              error={isQuestionRequired(aq.EA_SA_rfRequiredQuestion) && !fieldValue}
              helperText={isQuestionRequired(aq.EA_SA_rfRequiredQuestion) && !fieldValue ? "This question is required!" : ""}
            />
          }
          {recordInfo.crudAction == "view" &&
            <TextField
              label={fieldLabel(data.EA_SA_txtaQuestion)}
              value={fieldValue}
              InputProps={{ readOnly: true }}
            />
          }
        </FormControl>
      ))}
    </>
  );
};