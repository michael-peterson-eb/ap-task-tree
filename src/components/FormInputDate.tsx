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
export const FormInputDate = (props: FormInputProps) => {

  const {
    fieldName,
    recordInfo,
    qtype,
    data,
    onChange,
    lookup,
    fnSecQA,
    fnReqField} = props;

  const [assessQuestions, setAssessQuestion] = useState([]);
  const [dateValue, setDateValue] = useState<Dayjs | null>(null);

  const templateId = data.id;

  const getDateValue = (id: any, fieldValue: any) => {
    let returnValue:any = null;
    const dvalue = getValue(lookup, id, fieldValue);

    if ( dvalue != "" ) returnValue = dayjs(dvalue);
    return returnValue;
  }

  useEffect(() => {
    const fetchQuestionsAndOptions = async () => {
      const assessQuestions = await fetchAssessQuestionsByTemplateId(recordInfo, templateId);

      if (assessQuestions && assessQuestions.length > 0 ) {
        const respValue = assessQuestions[0].EA_SA_ddResponse;
        setAssessQuestion(assessQuestions);
        setDateValue(dayjs(respValue));

        fnSecQA(templateId, templateId, respValue);
      }
    }

    fetchQuestionsAndOptions().catch(console.error);

  }, [templateId])

  return (
    <div>
      {assessQuestions.length > 0 && assessQuestions.map((aq: any) => (
        <ThemeProvider theme={CustomFontTheme}>
          <FormControl fullWidth sx={{ marginTop: 4}} variant="standard">
             {recordInfo.crudAction == "edit" &&
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={aq.name}
                  value={getDateValue(aq.id, aq.EA_SA_ddResponse)}
                  disablePast={true}
                  onChange={(newValue: any) => {
                    setDateValue(newValue);
                    onChange('DATE', null, {
                      id: aq.id,
                      name: fieldName,
                      value: newValue
                    });
                    fnReqField();
                  }}
                  readOnly={recordInfo.crudAction === 'view' ? true : false}
                  slotProps={{
                    actionBar: {
                      actions: ["clear"],
                    },
                  }}
                />
              </LocalizationProvider>
            }
            {recordInfo.crudAction == "view" &&
              <TextField
                label={aq.name}
                value={dayjs(getDateValue(aq.id, aq.EA_SA_ddResponse)).format('MM/DD/YYYY')}
                InputProps={{ readOnly: true }}
              />
            }
          </FormControl>
        </ThemeProvider>
      ))}
    </div>
  );
};