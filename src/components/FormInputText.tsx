import { useEffect, useState } from 'react';
import { FormInputProps } from "./FormInputProps";
import { TextField, FormControl, Box, InputLabel } from '@mui/material';

import {
  fetchAssessQuestionsByTemplateId,
  getAssessmentQuestion
} from "../model/Questions";

import {
  initSelectValue,
  getValue,
  appendQuestions,
  cleanLabel,
  showLabel,
} from '../common/Utils';

import DOMPurify from "dompurify";
import { fieldLabel } from './Helpers';

export const FormInputText = (props: FormInputProps) => {
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

  const templateId = data.id;

  const isQuestionRequired = (flag:any) => {
    return flag == 1;
  }

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
        fnSecQA(aqFieldValue); // track section question states
      }
    }
    fetchQuestionsAndOptions().catch(console.error);

  }, [templateId])

  return (
    <>
      {assessQuestions.length > 0 && assessQuestions.map((aq: any) => (
        <FormControl fullWidth sx={{ marginTop: 1, marginBottom: 1 }} variant="standard">
          {recordInfo.crudAction == "edit" &&
            <Box
              component="form"
              sx={{'& .MuiTextField-root': {width: '100%' },}}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  sx={{ m:0, "&:hover": { backgroundColor: "transparent" } }}
                  required={isQuestionRequired(aq.EA_SA_rfRequiredQuestion)}
                  id={aq.id}
                  label={showLabel(withLabel, fieldLabel(data.EA_SA_txtaQuestion))}
                  name={fieldName}
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
              </div>
            </Box>
          }
          {recordInfo.crudAction == "view" &&
            <TextField
              label={showLabel(withLabel, fieldLabel(data.EA_SA_txtaQuestion))}
              value={fieldValue}
              InputProps={{ readOnly: true }}
            />
          }
        </FormControl>
      ))}
    </>
  );
};

