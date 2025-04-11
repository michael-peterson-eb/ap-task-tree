import {useEffect, useState, Fragment, useRef} from 'react';
import { FormInputProps } from "../../types/FormInputProps";
import { FormControl, TextField, ThemeProvider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs';
import { CustomFontTheme } from '../../style/CustomTheme';

import {
  getAssessmentQuestion
} from "../../model/Questions";

import { getValue, showLabel } from '../../utils/common';
import { setInnerHTML } from '../../utils/cleanup';
import { FieldValue } from './DisplayFieldValue';

export const FormInputDate = (props: FormInputProps) => {

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
  const [dateValue, setDateValue] = useState<Dayjs | null>(null);
  const aqAnswer = useRef(null);

  const templateId = data.id;

  const getDateValue = (id: any, fieldValue: any) => {
    let returnValue:any = null;
    const dvalue = getValue(lookup, id, fieldValue);

    if ( dvalue != "" ) returnValue = dayjs(dvalue);
    return returnValue;
  }

  const formatDate = (id:number, fieldValue:any) => {
    const dteValue = getDateValue(id, fieldValue);

    if ( dteValue === null ) return "No Answer";
    return dayjs(dteValue).format('MM/DD/YYYY')
  }

  useEffect(() => {
    const fetchQuestionsAndOptions = async () => {

      const assessQuestions:any = await getAssessmentQuestion(recordInfo, templateId, preloadedAQ);

      if (assessQuestions && assessQuestions.length > 0 ) {
        const respValue = fieldName != null ? assessQuestions[0][fieldName] : "";
        setAssessQuestion(assessQuestions);
        setDateValue(dayjs(respValue));

        fnSecQA(templateId, templateId, respValue);
        aqAnswer.current = assessQuestions[0];
      }
    }

    fetchQuestionsAndOptions().catch(console.error);

  }, [templateId])

  return (
    <Fragment>
      {assessQuestions.length > 0 && assessQuestions.map((aq: any) => (
        <ThemeProvider theme={CustomFontTheme}>
          <FormControl fullWidth variant="standard">
             {recordInfo.crudAction == "edit" &&
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={showLabel(withLabel, setInnerHTML(aq.name))}
                  value={getDateValue(aq.id, aq.EA_SA_ddResponse)}
                  disablePast={true}
                  onChange={(newValue: any) => {
                    setDateValue(newValue);
                    onChange('DATE', null, {
                      id: aq.id,
                      name: fieldName,
                      value: newValue
                    }, aqAnswer.current);
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
              <FieldValue
                withLabel={withLabel}
                fieldValue={fieldName ? formatDate(aq.id, aq[fieldName]) : ""}
                data={data}
              />
            }
          </FormControl>
        </ThemeProvider>
      ))}
    </Fragment>
  );
};