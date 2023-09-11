import { useEffect, useState } from 'react';
import {
  Select,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

import { FormInputProps } from "./FormInputProps";
import {
  fetchQuestionsIntervalsByTemplateId
} from "../model/Questions";
import {
  fetchResponseOptionsByTemplateId
} from "../model/ResponseOptions";

import { getNameValue, getValue } from '../common/Utils';

export const FormTimeInterval = ({ recordInfo, qtype, data, onChange, lookup }: FormInputProps) => {
  const [questionsInterval, setQuestionsInterval] = useState([]);
  const [quesResponseOptions, setQuesResponseOptions] = useState([]);

  const templateId = data.id;
  useEffect(() => {
    // declare the async data fetching function
    const fetchQuestionsAndOptions = async () => {
      const intervalQuestions = await fetchQuestionsIntervalsByTemplateId(recordInfo, data.id);
      //console.log("--fetchQuestionsIntervalsByTemplateId--", intervalQuestions)

      const responseOptions = await fetchResponseOptionsByTemplateId(templateId);
      //console.log("--fetchQuestionsIntervalsByTemplateId:options--", responseOptions)

      setQuestionsInterval(intervalQuestions);
      setQuesResponseOptions(responseOptions);
    }

    fetchQuestionsAndOptions().catch(console.error);

  }, [templateId])

  if ( questionsInterval.length == 0 ) return "";

  return (
    <div>
      <InputLabel sx={{ marginTop: 4, color: '#000' }} required={data.EA_SA_cbRequiredQuestion ? true : false}>
        {questionsInterval.length > 0 && questionsInterval[0].name}
      </InputLabel>
      <TableContainer component={Paper} sx={{ border: '1px solid #CCC', width: 'inherit' }}>
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
              <TableCell style={{ width: '20%' }}>Time Interval</TableCell>
              <TableCell style={{ width: '80%' }}>Impact</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questionsInterval.length > 0 && questionsInterval.map((qa) => (
              <TableRow key={qa.id}>
                <TableCell>
                  {qa.EA_SA_rfTimeInterval}
                </TableCell>
                <TableCell style={{ padding: '0px' }}>
                  {recordInfo.crudAction === 'edit' &&
                    <Select
                      sx={{ width: '100%' }}
                      style={{ fontSize: '14px' }}
                      name={qa.id}
                      native
                      defaultValue={getValue(lookup, qa.id, qa.EA_SA_rsAssessmentResponseOptions)}
                      onChange={(event: any) => {
                        onChange('SSP', event);
                      }}
                    >
                      <option aria-label="None" value="">Select Impact</option>
                      {quesResponseOptions.length > 0 && quesResponseOptions.map((item: any) => {
                        return <option value={item.id}>{item.name}</option>
                      })}
                    </Select>
                  }
                  {recordInfo.crudAction === 'view' &&
                    <div style={{padding: '0px 16px'}}>{getNameValue(quesResponseOptions, qa.EA_SA_rsAssessmentResponseOptions)}</div>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};