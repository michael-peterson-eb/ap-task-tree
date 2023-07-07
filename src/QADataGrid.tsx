import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'

const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'EA_SA_cbRequiredQuestion', headerName: 'Req', width: 10 },
  { field: 'EA_SA_txtaQuestion', headerName: 'Question', width: 300 },
  { field: 'body', headerName: 'Answer', width: 600 }
]

const QADataGrid = (props) => {

  const [tableData, setTableData] = useState([])

  useEffect(() => {
    const condition = `EA_SA_rsAssessmentQuestionType = ${props.qtype.id} ORDER BY EA_SA_intDisplayOrder ASC`
    const fields = [
        'id',
        'EA_SA_ddlResponseFormat#code',
        'EA_SA_cbIncludeFileUpload',
        'EA_SA_txtaQuestion',
        'EA_SA_intDisplayOrder',
        'EA_SA_cbAskPerTimeInterval',
        'EA_SA_cbRequiredQuestion',
        'EA_SA_cbIncludeFileUpload',
        'EA_SA_intQuestionWeighting'
    ]

    _RB.selectQuery(fields,'EA_SA_AssessmentQuestionTemplate', condition, 10000, true)
      .then((data) => setTableData(data))
  }, [props.qtype.id])

  console.log('--props--',props, tableData)

  return (
    <div style={{ height: 700, width: '100%' }}>
      <DataGrid
        rows={tableData}
        columns={columns}
        pageSize={12}
      />
    </div>
  )
}

export default QADataGrid