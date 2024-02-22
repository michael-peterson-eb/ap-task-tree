import {useEffect, useState} from 'react';
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
    MenuItem,
    FormHelperText,
    InputLabel,
    OutlinedInput,
} from '@mui/material';
import { getValue } from '../common/Utils';

export const FormSingleSelect = (props: FormInputProps) => {
  const {recordInfo, qtype, data, onChange, lookup, fnSecQA, fnReqField} = props;

  const [assessQuestions, setAssessQuestion] = useState([]);
  const [quesResponseOptions, setQuesResponseOptions] = useState([]);

  const templateId = data.id;

  useEffect(() => {
    // declare the async data fetching function
    const fetchQuestionsAndOptions = async () => {
      const assessQuestions = await fetchAssessQuestionsByTemplateId(recordInfo, templateId);
      setAssessQuestion(assessQuestions);
      console.log("--fetchAssessQuestionsByTemplateId--", assessQuestions)

      const responseOptions = await fetchResponseOptionsByTemplateId(templateId);
      console.log("--fetchResponseOptionsByTemplateId--", responseOptions)

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
          <InputLabel
            id={`single-select-${aq.id}`}
            size={'normal'}
            sx={{ background: '#FFF', paddingRight: '4px', fontSize: '18px'}}>
              {aq.name.trim()}
          </InputLabel>
          <Select
            labelId={`single-select-${aq.id}`}
            id={aq.id}
            sx={{
              width: '100%',
              fontSize: '14px',
            }}
            name={aq.id}
            onChange={(event: any) => {
              onChange('SSP', event);
            }}
            inputProps={{ readOnly: recordInfo.crudAction === 'view' ? true : false }}
            defaultValue={getValue(lookup, aq.id, aq.EA_SA_rsAssessmentResponseOptions)}
          >
            <MenuItem value="">Select option</MenuItem>
            {quesResponseOptions.length > 0 && quesResponseOptions.map((item: any) => (
              <MenuItem value={item.id} sx={{fontSize: '14px'}}>{item.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
    </div>
  );
};