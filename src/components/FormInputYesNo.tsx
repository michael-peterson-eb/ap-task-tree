import {Fragment, useEffect, useState} from 'react';
import { FormInputProps } from "./FormInputProps";

import {
  fetchAssessQuestionsByTemplateId
} from "../model/Questions";

import {
  fetchResponseOptionsByTemplateId
} from "../model/ResponseOptions";

import {
    FormControl,
    Select,
    InputLabel,
    TextField,
} from '@mui/material';
import { getValue, getNameValue } from '../common/Utils';

export const FormYesNo = (props: FormInputProps) => {
  const {recordInfo, qtype, data, onChange, lookup, fnSecQA, fnReqField} = props;

  const [assessQuestions, setAssessQuestion] = useState([]);
  const [quesResponseOptions, setQuesResponseOptions] = useState([]);
  const [fieldValue, setFieldValue] = useState('');

  const templateId = data.id;

  useEffect(() => {
    // declare the async data fetching function
    const fetchQuestionsAndOptions = async () => {
      const assessQuestions = await fetchAssessQuestionsByTemplateId(recordInfo, templateId);
      setAssessQuestion(assessQuestions);

      const responseOptions = await fetchResponseOptionsByTemplateId(templateId);
      const aqFieldValue = assessQuestions[0].EA_SA_rsAssessmentResponseOptions;
      const aqId = assessQuestions[0].id;
      const respValue = getValue(lookup, aqId, aqFieldValue);

      setFieldValue(respValue);
      setQuesResponseOptions(responseOptions);
    }

    // call the function and catch any error
    fetchQuestionsAndOptions()
      .catch(console.error);

  }, [templateId])

  return (
    <div>
      {assessQuestions.length > 0 && assessQuestions.map((aq: any) => (
        <FormControl sx={{  marginTop: 4, width: '100%' }}>
           {recordInfo.crudAction == "edit" &&
            <Fragment>
              <InputLabel id={`yesno-${aq.id}`} size={'normal'} sx={{ background: '#FFF', paddingRight: '4px', fontSize: '18px'}}>
                {aq.name.trim()}
              </InputLabel>
              <Select
                labelId={`yesno-${aq.id}`}
                id={aq.id}
                sx={{
                  width: '100%',
                  fontSize: '14px',
                }}
                name={'EA_SA_rsAssessmentResponseOptions'}
                onChange={(event: any) => {
                  const { id, name, value } = event.target;
                  setFieldValue(value);
                  onChange('SSP', event);
                  fnReqField();
                }}
                native
                inputProps={{ readOnly: recordInfo.crudAction === 'view' ? true : false }}
                value={fieldValue}
              >
                <option aria-label="" value="">Select option</option>
                {quesResponseOptions.length > 0 && quesResponseOptions.map((item: any) => {
                  return <option value={item.id}>{item.name}</option>
                })}
              </Select>
            </Fragment>
          }
          {recordInfo.crudAction == "view" &&
            <TextField
              label={data.EA_SA_txtaQuestion}
              value={getNameValue(quesResponseOptions, aq.EA_SA_rsAssessmentResponseOptions)}
              InputProps={{ readOnly: true }}
            />
          }
        </FormControl>
      ))}
    </div>
  );
};