import { useEffect, useState, Fragment, useRef } from 'react';
import { FormInputProps } from "./FormInputProps";
import { TextField, FormControl, Typography } from '@mui/material';

import {
  getAssessmentQuestion
} from "../model/Questions";

import {
    initSelectValue,
    getValue,
    isQuestionRequired,
    showLabel,
    fieldWithLabel,
} from '../common/Utils';

import { fieldLabel } from './Helpers';
import { FieldValue } from './DisplayFieldValue';

export const FormInputInteger = (props: FormInputProps) => {
  const {
    fieldName,
    recordInfo,
    qtype,
    data,
    onChange,
    lookup,
    fnSecQA,
    fnReqField,
    preloadedAQ,
    withLabel} = props;

  const [assessQuestions, setAssessQuestion] = useState([]);
  const [fieldValue, setFieldValue] = useState('');
  const aqAnswer = useRef(null);

  const templateId = data.id;

  useEffect(() => {
    const fetchQuestionsAndOptions = async () => {

      const assessQuestions:any = await getAssessmentQuestion(recordInfo, templateId, preloadedAQ);
      setAssessQuestion(assessQuestions);

      if (assessQuestions && assessQuestions.length > 0) {
        const aqId = assessQuestions[0].id;
        const aqFieldValue = fieldName != null ? assessQuestions[0][fieldName] : "";
        const lookupValue = lookup(aqId);

        let responseValue = aqFieldValue ? aqFieldValue : '';
        if ( lookupValue || lookupValue == '' ) responseValue = lookupValue;

        const respValue = getValue(lookup, aqId, aqFieldValue);
        const newValue = initSelectValue(recordInfo, respValue);
        setFieldValue(newValue);
        aqAnswer.current = assessQuestions[0];
      }
    }
    fetchQuestionsAndOptions().catch(console.error);

  }, [templateId])

  return (
    <Fragment>
      {assessQuestions.length > 0 && assessQuestions.map((aq: any) => (
        <FormControl fullWidth variant="standard">
          {recordInfo.crudAction == "edit" &&
            <TextField
              sx={{ m:0, "&:hover": { backgroundColor: "transparent" } }}
              required={isQuestionRequired(aq.EA_SA_rfRequiredQuestion)}
              id={aq.id}
              label={showLabel(withLabel, fieldLabel(data.EA_SA_txtaQuestion))}
              name={fieldName}
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
                onChange('INT', null, {id: id, name: name, value: value}, aqAnswer.current);
                fnReqField();
              }}
              error={isQuestionRequired(aq.EA_SA_rfRequiredQuestion) && !fieldValue}
              helperText={isQuestionRequired(aq.EA_SA_rfRequiredQuestion) && !fieldValue ? "This question is required!" : ""}
            />
          }
          {recordInfo.crudAction == "view" &&
            <FieldValue
              withLabel={withLabel}
              fieldValue={fieldValue}
              data={data}
            />
          }
        </FormControl>
      ))}
    </Fragment>
  );
};