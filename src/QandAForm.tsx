import { useState, useEffect, useRef } from 'react'
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

import { getAssessmentQuestionTemplateByType } from './model/QuestionTemplates'

const QandAForm = (props:any) => {
  const {
    recordInfo,
    qtype,
    handleFormValues,
    handleOnChange,
    customChangedHandler,
    lookupFV,
    fnSecQs,
    fnSecQA} = props;

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

  useEffect(() => {
    setTypeCompleted(qtype.status === 'completed' ? true : false);
    getAssessmentQuestionTemplateByType(qtype).then((data) => {

      setTableData(data);

      if ( recordInfo.crudAction === "edit" ) fnSecQs(data);  // track section questions state
    });
  }, [qtype.id]);

  return (
    <ThemeProvider theme={CustomFontTheme}>
      <Box sx={{ margin: 'auto', overflow: 'auto' }}>
        {recordInfo.crudAction === "view" && !isTypeCompleted &&
          <Alert sx={{ marginTop: '12px' }} severity="warning">
            <AlertTitle>{`${qtype.name} ${recordInfo.objectTitle} is in progress!`}</AlertTitle>
          </Alert>
        }
        {recordInfo.crudAction === "view" && isTypeCompleted &&
          <Alert sx={{ marginTop: '12px' }} severity="success">
            <AlertTitle>{`${qtype.name} ${recordInfo.objectTitle} is complete!`}</AlertTitle>
          </Alert>
        }

        {tableData.length > 0 && tableData.map((data) => {
          // Single-Select Picklist
          if (data.EA_SA_ddlResponseFormat === 'SSP' && data.EA_SA_cbAskPerTimeInterval == 0) {
            return <FormSingleSelect
              recordInfo={recordInfo}
              qtype={qtype}
              data={data}
              onChange={handleOnChange}
              lookup={lookupFV}
              fnSecQA={fnSecQA}/>
          }

          // Time Interval
          if (data.EA_SA_ddlResponseFormat === 'SSP' && data.EA_SA_cbAskPerTimeInterval == 1) {
            return <FormTimeInterval
              recordInfo={recordInfo}
              qtype={qtype}
              data={data}
              onChange={handleOnChange}
              lookup={lookupFV}
              fnSecQA={fnSecQA}/>
          }

          // Text Response
          if (data.EA_SA_ddlResponseFormat === 'FRES') {
            return <FormInputText
              recordInfo={recordInfo}
              qtype={qtype}
              data={data}
              onChange={handleOnChange}
              lookup={lookupFV}
              fnSecQA={fnSecQA}/>
          }

          // MSP - Multi-Select
          if (data.EA_SA_ddlResponseFormat === 'MSP') {
            return <FormMultiSelect
              recordInfo={recordInfo}
              qtype={qtype}
              data={data}
              onChange={customChangedHandler}
              lookup={lookupFV}
              fnSecQA={fnSecQA} />
          }

          // CCY - Currency
          if (data.EA_SA_ddlResponseFormat === 'CCY') {
            return <FormInputCurrency recordInfo={recordInfo} qtype={qtype} data={data} onChange={handleOnChange} />
          }
          // DATE - Date
          if (data.EA_SA_ddlResponseFormat === 'DATE') {
            return <FormInputDate
              recordInfo={recordInfo}
              qtype={qtype}
              data={data}
              onChange={customChangedHandler}
              lookup={lookupFV}
              fnSecQA={fnSecQA}/>
          }
        })}
        {recordInfo.crudAction === 'edit' &&
          <Alert sx={{ marginTop: '12px', marginBottom: '6px' }} severity="info">
            <AlertTitle>{recordInfo.objectTitle}</AlertTitle>
            <FormControlLabel control={
              <Checkbox
                id={qtype.id}
                name={qtype.id}
                checked={isTypeCompleted}
                onChange={(event: any) => {
                  const checked = event.target.checked;
                  qtype.status = checked ? "completed" : "on-going";
                  if (recordInfo.crudAction === 'edit') {
                    setTypeCompleted(checked);
                    customChangedHandler('STATUS', event, { name: qtype.id, value: checked });
                  }
                }}
                disabled={recordInfo.crudAction === 'view'}
                inputProps={{ 'aria-label': 'controlled' }} />
            } label={`Checked if ${qtype.name} ${recordInfo.objectTitle} is complete!`} />
          </Alert>
        }
      </Box>
    </ThemeProvider>
  )
}

export default QandAForm

