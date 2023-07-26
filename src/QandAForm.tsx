import { useState, useEffect } from 'react'
import {Box, ThemeProvider} from '@mui/material';

import { FormInputCurrency } from './components/FormInputCurrency';
import { FormInputNumber } from './components/FormInputNumber';
import { FormInputText } from './components/FormInputText';
import { FormMultiSelect } from './components/FormMultiSelect';
import { FormSingleSelect } from './components/FormSingleSelect';
import { FormTimeInterval } from './components/FormTimeInterval';
import { CustomFontTheme } from './common/CustomTheme';

import { fetchResponseOptionsByTemplateId } from './model/ResponseOptions';

import { getAssessmentQuestionTemplateByType } from './model/QuestionTemplates'

const QandAForm = ({recordInfo, qtype, handleFormValues, handleOnChange}) => {

  const [tableData, setTableData] = useState([]);

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

  const setOptionValues = (data:any) => {
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
    getAssessmentQuestionTemplateByType(qtype).then((data) => {
      //const options = await fetchResponseOptionsByTemplateId(qtype.id);
      setTableData(data);
      //setFormValues(data);
      console.log('--questionTemplate:QType--',qtype)
      console.log('--questionTemplate:Data--',data)
      //console.log('--questionTemplateOptions--',options)
      console.log('--questionTemplate:TableData--',tableData)
    });
  }, [qtype.id]);

  return (
    <ThemeProvider theme={CustomFontTheme}>
      <Box sx={{ width: '80%', margin: 'auto' }}>
        {tableData.length > 0 && tableData.map((data) => {
          // Single-Select Picklist
          if (data.EA_SA_ddlResponseFormat === 'SSP' && data.EA_SA_cbAskPerTimeInterval == 1 ){
            return <FormTimeInterval recordInfo={recordInfo} qtype={qtype} data={data} onChange={handleOnChange}/>
          }
          // Text Response
          if (data.EA_SA_ddlResponseFormat === 'FRES' )  {
            return <FormInputText data={data} name={data.id} onChange={handleOnChange}/>
          }
          // MSP - Multi-Select
          if (data.EA_SA_ddlResponseFormat === 'MSP' )  {
            return <FormMultiSelect recordInfo={recordInfo} qtype={qtype} data={data} onChange={handleOnChange}/>
          }
          // CCY - Currency
          if (data.EA_SA_ddlResponseFormat === 'CCY')  {
            return <FormInputCurrency data={data} name={data.id} onChange={handleOnChange}/>
          }
          // DATE - Date
        })}
      </Box>
    </ThemeProvider>
  )
}

export default QandAForm

