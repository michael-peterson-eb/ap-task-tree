import React, { useState, useEffect } from 'react'

import { FormInputCurrency } from './components/FormInputCurrency'
import { FormInputNumber } from './components/FormInputNumber'
import { FormInputText } from './components/FormInputText'

import { getAssessmentQuestionTemplateByType } from './model/QuestionTemplates'

const QandAForm = ({qtype}) => {

  const [tableData, setTableData] = useState([])

  useEffect(() => {
    getAssessmentQuestionTemplateByType(qtype).then((data) => setTableData(data))
  }, [qtype.id])

  console.log('--props--',qtype, tableData)

  return (
    <div style={{ height: 700, width: '100%' }}>
      {tableData.map((data) => {
        if (data.EA_SA_ddlResponseFormat === 'SSP')  {
          return <FormInputCurrency data={data}/>
        }

        if (data.EA_SA_ddlResponseFormat === 'FRES' )  {
          return <FormInputText data={data}/>
        }
      })}
    </div>
  )
}

export default QandAForm

