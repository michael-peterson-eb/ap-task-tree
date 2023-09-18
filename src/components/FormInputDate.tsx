import {useEffect, useState} from 'react';
import { FormInputProps } from "./FormInputProps";
import { FormControl, TextField, ThemeProvider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs';
import { CustomFontTheme } from '../common/CustomTheme';

import {
  fetchAssessQuestionsByTemplateId
} from "../model/Questions";

import { getValue } from '../common/Utils';
export const FormInputDate = ({ recordInfo, qtype, data, onChange, lookup}: FormInputProps) => {

  const [assessQuestions, setAssessQuestion] = useState([]);
  const [dateValue, setDateValue] = useState<Dayjs | null>(null);

  const templateId = data.id;

  const getDateValue = (id: any, fieldValue: any) => {
    const dvalue = getValue(lookup, id, fieldValue);
    return dayjs(dvalue);
  }

  useEffect(() => {
    const fetchQuestionsAndOptions = async () => {
      const assessQuestions = await fetchAssessQuestionsByTemplateId(recordInfo, templateId);
      setAssessQuestion(assessQuestions);
      console.log("----fetchQuestions----", assessQuestions)
      if (assessQuestions && assessQuestions.length > 0 ) {
        setDateValue(dayjs(assessQuestions[0].EA_SA_ddResponse));
      }
    }

    fetchQuestionsAndOptions().catch(console.error);

  }, [templateId])

  return (
    <div>
      {assessQuestions.length > 0 && assessQuestions.map((aq: any) => (
        <ThemeProvider theme={CustomFontTheme}>
          <FormControl fullWidth sx={{ marginTop: 4}} variant="standard">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={aq.name}
                value={getDateValue(aq.id, aq.EA_SA_ddResponse)}
                disablePast={true}
                onChange={(newValue: any) => {
                  setDateValue(newValue);
                  onChange('DATE', null, {name: aq.id, value: newValue});
                }}
                readOnly={recordInfo.crudAction === 'view' ? true : false}
                slotProps={{
                  actionBar: {
                      actions: ["clear"],
                  },
                }}
              />
            </LocalizationProvider>
          </FormControl>
        </ThemeProvider>
      ))}
    </div>
  );
};