import { useEffect, useState, Fragment } from 'react';
import { FormInputProps } from "./FormInputProps";
import {
  TextField,
  FormControl,
  Box,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

import {
  fetchAssessQuestionsByTemplateId
} from "../model/Questions";

import { initSelectValue, getValue, appendQuestions, cleanLabel } from '../common/Utils';

import DOMPurify from "dompurify";

export const FormInputText = (props: FormInputProps) => {
  const {recordInfo, qtype, data, onChange, lookup, fnSecQA, fnReqField} = props;

  const [assessQuestions, setAssessQuestion] = useState([]);
  const [fieldValue, setFieldValue] = useState('');
  const [peakFieldValue, setPeakFieldValue] = useState('');

  const templateId = data.id;

  const isQuestionRequired = (flag:any) => {
    return flag == 1;
  }

  const fieldLabel = (text:string) => {
    return(
      <div dangerouslySetInnerHTML={{
        __html: cleanLabel(text)
        }} />
    )
  }

  const requiredColor = () => {
    return isQuestionRequired(data.EA_SA_rfRequiredQuestion) ? "#d32f2f" : "#000"
  }

  useEffect(() => {
    const fetchQuestionsAndOptions = async () => {
      const assessQuestions = await fetchAssessQuestionsByTemplateId(recordInfo, templateId);
      setAssessQuestion(assessQuestions);

      if (assessQuestions && assessQuestions.length > 0) {
        const aqId = assessQuestions[0].id;
        const aqFieldValue = assessQuestions[0].EA_SA_txtaResponse;
        const lookupValue = lookup(aqId);

        let responseValue = aqFieldValue ? aqFieldValue : '';
        if ( lookupValue || lookupValue == '' ) responseValue = lookupValue;

        const respValue = getValue(lookup, aqId, aqFieldValue);
        const newValue = initSelectValue(recordInfo, respValue);
        setFieldValue(newValue);

        const aqOrFieldValue = assessQuestions[0].EA_OR_txtaResponse;
        const lookupOrValue = lookup(aqId);

        let responseOrValue = aqOrFieldValue ? aqOrFieldValue : '';
        if ( lookupOrValue || lookupOrValue == '' ) responseOrValue = lookupOrValue;

        const respOrValue = getValue(lookup, aqId, aqOrFieldValue);
        const newOrValue = initSelectValue(recordInfo, respOrValue);
        setPeakFieldValue(newOrValue);

        fnSecQA(aqFieldValue); // track section question states
      }
    }
    fetchQuestionsAndOptions().catch(console.error);

  }, [templateId])

  const nonSeverityField = (aq:any) => {
    return(
      <>
        <FormControl fullWidth sx={{ marginTop: 4 }} variant="standard">
          {recordInfo.crudAction == "edit" &&
            <Box
              component="form"
              sx={{'& .MuiTextField-root': {width: '100%' },}}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  sx={{ m:0, "&:hover": { backgroundColor: "transparent" } }}
                  required={isQuestionRequired(aq.EA_SA_rfRequiredQuestion)}
                  id={templateId}
                  label={data.EA_SA_txtaQuestion}
                  name={aq.id}
                  value={fieldValue}
                  InputProps={{
                    style: { fontSize: '14px' },
                    ...recordInfo.crudAction == 'view' ? { readOnly: true } : { readOnly: false }
                  }}
                  InputLabelProps={{ style: { fontSize: '18px', backgroundColor: '#FFF' } }}
                  onChange={(event: any) => {
                    const { name, value } = event.target;
                    setFieldValue(value);
                    onChange('FRES', event);
                    fnReqField();
                  }}
                  error={isQuestionRequired(aq.EA_SA_rfRequiredQuestion) && !fieldValue}
                  helperText={isQuestionRequired(aq.EA_SA_rfRequiredQuestion) && !fieldValue ? "This question is required!" : ""}
                />
              </div>
            </Box>
          }
          {recordInfo.crudAction == "view" &&
            <TextField
              label={fieldLabel(data.EA_SA_txtaQuestion)}
              value={fieldValue}
              InputProps={{ readOnly: true }}
            />
          }
        </FormControl>
      </>
    )
  }

  const withSeverityField = (aq:any) => {
    return (
      <Fragment>
        <TableContainer component={Paper} sx={{ marginTop: 4, border: `1px solid ${requiredColor()}`, width: 'inherit' }}>
          <Table sx={{ width: '100%' }} size="small">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#9cc1ff33",
                  "& th": {
                    fontSize: "1.25rem"
                  }
                }}
              >
                <TableCell style={{ width: '20%' }}>Severity Level</TableCell>
                <TableCell style={{ width: '40%' }}></TableCell>
                <TableCell style={{ width: '40%' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                <TableRow key={aq.id}>
                  <TableCell>
                    {aq.EA_SA_txtaQuestion}
                  </TableCell>
                  {aq.EA_OR_mddlPeriodsInScope == "EA_OR_Normal" &&
                    <TableCell style={{ padding: '0px', width: '40%' }}>
                      {recordInfo.crudAction === 'edit' &&
                        <TextField
                          sx={{ m:0, "&:hover": { backgroundColor: "transparent" } }}
                          required={isQuestionRequired(aq.EA_SA_rfRequiredQuestion)}
                          id={templateId}
                          label={"Impact at Normal Period"}
                          name={aq.id}
                          value={fieldValue}
                          InputProps={{
                            style: { fontSize: '14px' },
                            ...recordInfo.crudAction == 'view' ? { readOnly: true } : { readOnly: false }
                          }}
                          InputLabelProps={{ style: { fontSize: '18px', backgroundColor: '#FFF' } }}
                          onChange={(event: any) => {
                            const { name, value } = event.target;
                            setFieldValue(value);
                            onChange('FRES', event);
                            fnReqField();
                          }}
                          error={isQuestionRequired(aq.EA_SA_rfRequiredQuestion) && !fieldValue}
                          helperText={isQuestionRequired(aq.EA_SA_rfRequiredQuestion) && !fieldValue ? "This question is required!" : ""}
                          fullWidth
                        />
                      }
                      {recordInfo.crudAction == "view" &&
                        <TextField
                          label={fieldLabel(data.EA_SA_txtaQuestion)}
                          value={fieldValue}
                          InputProps={{ readOnly: true }}
                        />
                      }
                    </TableCell>
                  }
                  {aq.EA_OR_mddlPeriodsInScope == "EA_OR_Peak" &&
                    <TableCell style={{ padding: '0px' }}>
                      {recordInfo.crudAction === 'edit' &&
                        <TextField
                          sx={{ m:0, "&:hover": { backgroundColor: "transparent" } }}
                          required={isQuestionRequired(aq.EA_SA_rfRequiredQuestion)}
                          id={templateId}
                          label={"Impact at Peak Period"}
                          name={aq.id}
                          value={peakFieldValue}
                          InputProps={{
                            style: { fontSize: '14px' },
                            ...recordInfo.crudAction == 'view' ? { readOnly: true } : { readOnly: false }
                          }}
                          InputLabelProps={{ style: { fontSize: '18px', backgroundColor: '#FFF' } }}
                          onChange={(event: any) => {
                            const { name, value } = event.target;
                            setPeakFieldValue(value);
                            onChange('FRES', event);
                            fnReqField();
                          }}
                          error={isQuestionRequired(aq.EA_SA_rfRequiredQuestion) && !peakFieldValue}
                          helperText={isQuestionRequired(aq.EA_SA_rfRequiredQuestion) && !peakFieldValue ? "This question is required!" : ""}
                          fullWidth={true}
                        />
                      }
                      {recordInfo.crudAction == "view" &&
                        <TextField
                          label={fieldLabel(data.EA_SA_txtaQuestion)}
                          value={peakFieldValue}
                          InputProps={{ readOnly: true }}
                        />
                      }
                    </TableCell>
                  }
                </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Fragment>
    )
  }

  return (

    <Fragment>
      {assessQuestions.length > 0 && assessQuestions.map((aq: any) => (
        <>
          {aq.EA_SA_ddlAskPer == null && nonSeverityField(aq)}
          {aq.EA_SA_ddlAskPer == "EA_SA_SeverityLevel" && withSeverityField(aq)}
        </>
      ))}
    </Fragment>
  );
};