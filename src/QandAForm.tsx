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
import { FormInputInteger } from './components/FormInputInteger';
import { FormInputDecimal } from './components/FormInputDecimal';
import { FormYesNo } from './components/FormInputYesNo';

import {
  getAssessmentQuestionTemplateByType } from './model/QuestionTemplates'

import {
  fetchAssessQuestionsByTemplateId,
  fetchQuestionsIntervalsByTemplateId } from "./model/Questions";

import { initSelectValue, getValue, getQuestionAnswer } from './common/Utils';

const QandAForm = (props:any) => {
  const {
    recordInfo,
    qtype,
    handleFormValues,
    handleOnChange,
    customChangedHandler,
    lookupFV,
    fnSecQs,
    fnSecQA,
    fnDoneWithReqField} = props;

  const [tableData, setTableData] = useState([]);
  const [isTypeCompleted, setTypeCompleted] = useState(false);
  const [isReqFieldValid, setReqFieldValid] = useState(true);

  const editMode = recordInfo.crudAction === "edit";

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

  const checkRequiredFields = () => {
    const validRF = fnDoneWithReqField();
    if (isTypeCompleted && !validRF) {
      customChangedHandler('STATUS', null, { name: qtype.id, value: false });
      setTypeCompleted(false);
    }
    setReqFieldValid(validRF);
  }

  const getExistingAnswers = (templateData:any) => {
    const asQs:any[] = [];
    templateData.map(async (data:any) => {
      const tId = data.id;
      if (data.EA_SA_ddlResponseFormat === 'SSP' && data.EA_SA_cbAskPerTimeInterval == 1 ) {
        const intervalQuestions = await fetchQuestionsIntervalsByTemplateId(recordInfo, tId);

      } else {
        const assessQuestions = await fetchAssessQuestionsByTemplateId(recordInfo, tId);
        const [found, qaId, newValue] = getQuestionAnswer(recordInfo, lookupFV, assessQuestions, "EA_SA_txtaResponse");
        if ( found ) fnSecQA(tId, qaId, newValue);
      }
    });
  }

  useEffect(() => {
    setTypeCompleted(qtype.status === 'completed' ? true : false);
    getAssessmentQuestionTemplateByType(qtype).then((data) => {
      setTableData(data);
      if ( editMode ) {
        fnSecQs(data);  // track section questions state
        getExistingAnswers(data);

        setTimeout(() => {
          checkRequiredFields();
        },500);

      }
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

        {tableData.length > 0 && tableData.map((data:any) => {
          // Single-Select Picklist
          if (data.EA_SA_ddlResponseFormat === 'SSP' && data.EA_SA_cbAskPerTimeInterval == 0) {
            return <FormSingleSelect
              recordInfo={recordInfo}
              qtype={qtype}
              data={data}
              onChange={handleOnChange}
              lookup={lookupFV}
              fnSecQA={fnSecQA}
              fnReqField={checkRequiredFields}/>
          }

          // Time Interval
          if (data.EA_SA_ddlResponseFormat === 'SSP' && data.EA_SA_cbAskPerTimeInterval == 1) {
            return <FormTimeInterval
              recordInfo={recordInfo}
              qtype={qtype}
              data={data}
              onChange={handleOnChange}
              lookup={lookupFV}
              fnSecQA={fnSecQA}
              fnReqField={checkRequiredFields}/>
          }

          // Text Response
          if (data.EA_SA_ddlResponseFormat === 'FRES') {
            return <FormInputText
              recordInfo={recordInfo}
              qtype={qtype}
              data={data}
              onChange={handleOnChange}
              lookup={lookupFV}
              fnSecQA={fnSecQA}
              fnReqField={checkRequiredFields}/>
          }

          // MSP - Multi-Select
          if (data.EA_SA_ddlResponseFormat === 'MSP') {
            return <FormMultiSelect
              recordInfo={recordInfo}
              qtype={qtype}
              data={data}
              onChange={customChangedHandler}
              lookup={lookupFV}
              fnSecQA={fnSecQA}
              fnReqField={checkRequiredFields}/>
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
              fnSecQA={fnSecQA}
              fnReqField={checkRequiredFields}/>
          }

          // INT - Integer
          if (data.EA_SA_ddlResponseFormat === 'INT') {
            return <FormInputInteger
              recordInfo={recordInfo}
              qtype={qtype}
              data={data}
              onChange={customChangedHandler}
              lookup={lookupFV}
              fnSecQA={fnSecQA}
              fnReqField={checkRequiredFields}/>
          }

          // DEC - Decimal
          if (data.EA_SA_ddlResponseFormat === 'DEC') {
            return <FormInputDecimal
              recordInfo={recordInfo}
              qtype={qtype}
              data={data}
              onChange={customChangedHandler}
              lookup={lookupFV}
              fnSecQA={fnSecQA}
              fnReqField={checkRequiredFields}/>
          }

          // YN - Yes/No
          if (data.EA_SA_ddlResponseFormat === 'YN') {
            return <FormYesNo
              recordInfo={recordInfo}
              qtype={qtype}
              data={data}
              onChange={handleOnChange}
              lookup={lookupFV}
              fnSecQA={fnSecQA}
              fnReqField={checkRequiredFields}/>
          }
        })}

        {editMode &&
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
                    customChangedHandler('STATUS', event, { id: qtype.id, name: qtype.id, value: checked });
                  }
                }}
                disabled={!isReqFieldValid}
                inputProps={{ 'aria-label': 'controlled' }} />
            } label={`Checked if ${qtype.name} ${recordInfo.objectTitle} is complete!`} />
          </Alert>
        }
      </Box>
    </ThemeProvider>
  )
}

export default QandAForm

