import {useEffect, useState} from 'react';
import {
    FormControl,
    Select,
    MenuItem,
    FormHelperText,
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

export const FormTimeInterval = ({recordInfo, qtype, data, onChange}: FormInputProps) => {
  const [questionsInterval, setQuestionsInterval] = useState([]);
  const [quesResponseOptions, setQuesResponseOptions] = useState([]);

  const templateId = data.id;
  useEffect(() => {
    // declare the async data fetching function
    const fetchQuestionsAndOptions = async () => {
      const intervalQuestions = await fetchQuestionsIntervalsByTemplateId(recordInfo, data.id);
      console.log("--fetchQuestionsIntervalsByTemplateId--", intervalQuestions)

      const responseOptions = await fetchResponseOptionsByTemplateId(templateId);
      console.log("--fetchQuestionsIntervalsByTemplateId:options--", responseOptions)

      setQuestionsInterval(intervalQuestions);
      setQuesResponseOptions(responseOptions);
    }

    // call the function and catch any error
    fetchQuestionsAndOptions()
      .catch(console.error);

  }, [templateId])
console.log("--FormTimeInterval--", templateId, data)
  return (
    <div>
      <InputLabel style={{ fontSize: '14px' }}>{questionsInterval.length > 0 && questionsInterval[0].name}</InputLabel>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Time Interval</TableCell>
              <TableCell>Impact</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questionsInterval.length > 0 && questionsInterval.map((qa) => (
              <TableRow key={qa.id}>
                <TableCell>
                  {qa.EA_SA_rfTimeInterval}
                </TableCell>
                <TableCell style={{padding: '0px'}}>
                  <FormControl sx={{ m: 1, minWidth: 120, margin: '4px' }} size="small">
                    <Select style={{ fontSize: '14px' }} native name={qa.id} defaultValue={qa.EA_SA_rsAssessmentResponseOptions} onChange={onChange}>
                      <option aria-label="None" value="">Please select</option>
                      {quesResponseOptions.length > 0 && quesResponseOptions.map((item:any) => {
                        return <option value={item.id}>{item.name}</option>
                      })}
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};