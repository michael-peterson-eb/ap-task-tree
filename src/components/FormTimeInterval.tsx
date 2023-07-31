import {useEffect, useState} from 'react';
import {
    FormControl,
    Select,
    MenuItem,
    TextField,
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

  const getNameValue = (options: any, id: any) => {
    if (!id) return "No Answer";
    const found = options.find(opt => opt.id == id);
    console.log("---get----", found, options, id)
    return found.name;
  }

  console.log("--FormTimeInterval--", templateId, data)
  return (
    <div>
      <InputLabel style={{ fontSize: '14px' }}>{questionsInterval.length > 0 && questionsInterval[0].name}</InputLabel>
      <TableContainer component={Paper} sx={{marginBottom: '16px'}}>
        <Table sx={{width: '100%'}} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{width: '20%'}}>Time Interval</TableCell>
              <TableCell style={{width: '80%'}}>Impact</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questionsInterval.length > 0 && questionsInterval.map((qa) => (
              <TableRow key={qa.id}>
                <TableCell>
                  {qa.EA_SA_rfTimeInterval}
                </TableCell>
                <TableCell style={{padding: '0px'}}>
                  {recordInfo.crudAction === 'edit' &&
                    <Select
                      sx={{ width: '100%' }}
                      style={{ fontSize: '14px'}}
                      name={qa.id}
                      native
                      defaultValue={qa.EA_SA_rsAssessmentResponseOptions}
                      onChange={(event: any) => {
                        onChange('SSP', event);
                      }}
                    >
                      <option aria-label="None" value="">Select Impact</option>
                      {quesResponseOptions.length > 0 && quesResponseOptions.map((item:any) => {
                        return <option value={item.id}>{item.name}</option>
                      })}
                    </Select>
                  }

                  {recordInfo.crudAction === 'view' &&
                    <div>{getNameValue(quesResponseOptions, qa.EA_SA_rsAssessmentResponseOptions)}</div>
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