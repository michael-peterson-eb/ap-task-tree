import { useState, useEffect } from 'react'
import {
  Box,
  ThemeProvider,
  Checkbox,
  FormControlLabel,
  Alert,
  AlertTitle,
} from '@mui/material';

import { FormInputCurrency } from './components/FormInputCurrency';
import { FormInputNumber } from './components/FormInputNumber';
import { FormInputText } from './components/FormInputText';
import { FormMultiSelect } from './components/FormMultiSelect';
import { FormSingleSelect } from './components/FormSingleSelect';
import { FormTimeInterval } from './components/FormTimeInterval';
import { FormInputDate } from './components/FormInputDate';
import { CustomFontTheme } from './common/CustomTheme';

import { fetchResponseOptionsByTemplateId } from './model/ResponseOptions';

import { getAssessmentQuestionTemplateByType } from './model/QuestionTemplates'

const QandAForm = ({ recordInfo, qtype, handleFormValues, handleOnChange, customChangedHandler }) => {

  const [tableData, setTableData] = useState([]);
  const [isTypeCompleted, setTypeCompleted] = useState(false);

  const setFormValues = (data: any) => {
    const formValues: any = {};
    data.forEach((d: any) => {
      formValues[d.id] = {
        value: '',
        error: false,
        errorMsg: 'Cannot be blank'
      }
    });
    handleFormValues(formValues);
  }

  const setOptionValues = (data: any) => {
    const optionValues: any = {};
    data.forEach((datum: any) => {
      optionValues[datum.id] = {
        value: '',
        error: false,
        errorMsg: 'Cannot be blank'
      }
    });
  }
  console.log("--QAForm--", recordInfo, qtype)
  useEffect(() => {
    setTypeCompleted(qtype.status === 'completed' ? true : false);
    getAssessmentQuestionTemplateByType(qtype).then((data) => {
      //const options = await fetchResponseOptionsByTemplateId(qtype.id);
      setTableData(data);
      //setFormValues(data);
      console.log('--questionTemplate:QType--', qtype)
      console.log('--questionTemplate:Data--', data)
      //console.log('--questionTemplateOptions--',options)
      console.log('--questionTemplate:TableData--', tableData)
    });
  }, [qtype.id]);

  return (
    <ThemeProvider theme={CustomFontTheme}>
      <Box sx={{ margin: 'auto' }}>
        {tableData.length > 0 && tableData.map((data) => {
          // Single-Select Picklist
          if (data.EA_SA_ddlResponseFormat === 'SSP' && data.EA_SA_cbAskPerTimeInterval == 1) {
            return <FormTimeInterval recordInfo={recordInfo} qtype={qtype} data={data} onChange={handleOnChange} />
          }
          // Text Response
          if (data.EA_SA_ddlResponseFormat === 'FRES') {
            return <FormInputText recordInfo={recordInfo} qtype={qtype} data={data} onChange={handleOnChange} />
          }
          // MSP - Multi-Select
          if (data.EA_SA_ddlResponseFormat === 'MSP') {
            return <FormMultiSelect recordInfo={recordInfo} qtype={qtype} data={data} onChange={customChangedHandler} />
          }
          // CCY - Currency
          if (data.EA_SA_ddlResponseFormat === 'CCY') {
            return <FormInputCurrency recordInfo={recordInfo} qtype={qtype} data={data} onChange={handleOnChange} />
          }
          // DATE - Date
          if (data.EA_SA_ddlResponseFormat === 'DATE') {
            return <FormInputDate recordInfo={recordInfo} qtype={qtype} data={data} onChange={customChangedHandler} />
          }
        })}
        <Alert sx={{ marginTop: '12px' }} severity="info">
          <AlertTitle>Impact Assessment</AlertTitle>
          <FormControlLabel control={
            <Checkbox
              id={qtype.id}
              name={qtype.id}
              checked={isTypeCompleted}
              onChange={(event: any) => {
                console.log("--completed--", event.target.checked)
                const checked = event.target.checked;
                qtype.status = checked ? "completed" : "on-going";
                setTypeCompleted(checked);
                customChangedHandler('STATUS', event, { name: qtype.id, value: checked });

              }}
              inputProps={{ 'aria-label': 'controlled' }} />
          } label={`Checked if ${qtype.name} Impact Assessment is complete!`} />
        </Alert>
      </Box>
    </ThemeProvider>
  )
}

export default QandAForm

