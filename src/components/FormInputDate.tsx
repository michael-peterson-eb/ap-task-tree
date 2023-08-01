import {useEffect, useState} from 'react';
import { FormInputProps } from "./FormInputProps";
import { FormControl} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

import {
  fetchAssessQuestionsByTemplateId
} from "../model/Questions";

export const FormInputDate = ({ recordInfo, qtype, data, onChange}: FormInputProps) => {

  const [assessQuestions, setAssessQuestion] = useState([]);
  const [dateValue, setDateValue] = useState<Dayjs | null>(null);

  const templateId = data.id;

  useEffect(() => {
    const fetchQuestionsAndOptions = async () => {
      const assessQuestions = await fetchAssessQuestionsByTemplateId(recordInfo, templateId);
      setAssessQuestion(assessQuestions);

      if (assessQuestions.lenght > 0 ) setDateValue(assessQuestions[0].EA_SA_txtaResponse)
    }

    fetchQuestionsAndOptions().catch(console.error);

  }, [templateId])

  return (
    <div>
      {assessQuestions.length > 0 && assessQuestions.map((aq: any) => (
        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
          <DatePicker
            label={aq.name}
            value={dateValue}
            onChange={(newValue) => {
              setDateValue(newValue);
              onChange('DATE', null, {name: aq.id, value: newValue});
            }}
          />
        </FormControl>
      ))}
    </div>
  );
};