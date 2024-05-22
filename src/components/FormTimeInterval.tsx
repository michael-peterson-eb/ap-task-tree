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
  FormControl,
  FormGroup
} from '@mui/material';

import { FormInputProps } from "./FormInputProps";
import {
  fetchQuestionsIntervalsByTemplateId
} from "../model/Questions";
import {
  fetchResponseOptionsByTemplateId
} from "../model/ResponseOptions";

import DOMPurify from "dompurify";

import { getNameValue, getValue, stripTextHtmlTags } from '../common/Utils';

export const FormTimeInterval = (props: FormInputProps) => {
  const {
    fieldName,
    recordInfo,
    qtype,
    data,
    onChange,
    lookup,
    fnSecQA,
    fnReqField} = props;

  const [questionsInterval, setQuestionsInterval] = useState([]);
  const [quesResponseOptions, setQuesResponseOptions] = useState([]);
  const [timeIntervalUpdated, setTimeIntervalUpdated] = useState(false);

  const templateId = data.id;

  const checkTimeIntervalHasValue = ()=> {
    const found = questionsInterval.filter( (qi:any) => {
      return qi.EA_SA_rsAssessmentResponseOptions && parseInt(qi.EA_SA_rsAssessmentResponseOptions) > 0
    });

    const cached = questionsInterval.filter( (qi:any) => {
      const val = getValue(lookup, qi.id, qi.EA_SA_rsAssessmentResponseOptions);
      return parseInt(val) > 0;
    });

    if ( found.length > 0 || cached.length > 0 ) {
      setTimeIntervalUpdated(true);

    } else {
      setTimeIntervalUpdated(false);
    }
  }

  const timeIntervalUpdate = (id: any, event: any) => {
    const { name, value } = event.target;

    let found:any = questionsInterval.find((quesInt:any) => {
      return quesInt.id == id;
    });

    const updatedMap = {
      ...found,
      ...{EA_SA_rsAssessmentResponseOptions: value == "" ? null : value}
    };

    const newQuesInterval:any = questionsInterval.map((qin) => {
      return qin.id == id ? updatedMap : qin;
    });

    setQuestionsInterval(newQuesInterval);
  }

  const doLookup = (id:any, optSelected:any) => {
    if (optSelected != null || optSelected != "") setTimeIntervalUpdated(true);
    return getValue(lookup, id, optSelected);
  }

  const isQuestionRequired = () => {
    return data.EA_SA_cbRequiredQuestion == 1 && !timeIntervalUpdated;
  }

  const requiredColor = () => {
    return isQuestionRequired() ? "#d32f2f" : "#000"
  }

  // check if at least one of the Time Interval question has value selected
  const atLeastOneTimeIntervalHasValue = (tiQs:any) => {
    let selected = "";
    tiQs.forEach((tQ:any) => {
     if ( getValue(lookup, tQ.id, tQ.EA_SA_rsAssessmentResponseOptions) != "" ) selected = "Yes";
    });

    return selected;
  }

  const cleanLabel = (htmlLabel:string) => {
    return DOMPurify.sanitize(htmlLabel, {
      USE_PROFILES: { html: true },
    })
  };

  useEffect(() => {
    const fetchQuestionsAndOptions = async () => {
      const intervalQuestions = await fetchQuestionsIntervalsByTemplateId(recordInfo, data.id);
      //console.log("--fetchQuestionsIntervalsByTemplateId--", intervalQuestions)

      const responseOptions = await fetchResponseOptionsByTemplateId(templateId);
      //console.log("--fetchQuestionsIntervalsByTemplateId:options--", responseOptions)

      setQuestionsInterval(intervalQuestions);
      setQuesResponseOptions(responseOptions);
      checkTimeIntervalHasValue();

      const tiSelected = atLeastOneTimeIntervalHasValue(intervalQuestions);
      fnSecQA(templateId, templateId, tiSelected);
    }

    fetchQuestionsAndOptions().catch(console.error);
  }, [templateId]);

  useEffect(() => {
    checkTimeIntervalHasValue();
  }, [timeIntervalUpdated, questionsInterval])

  if ( questionsInterval.length == 0 ) return "";

  return (
    <div>
      <FormGroup sx={{ paddingTop: 2 }}>
        <InputLabel
          sx={{ color:
            `${requiredColor()}`,
            whiteSpace: 'normal'
          }}
          required={data.EA_SA_cbRequiredQuestion == 1}
        >
          {questionsInterval.length > 0 && <div dangerouslySetInnerHTML={{
          __html: cleanLabel(questionsInterval[0].EA_SA_rfQuestion)
          }} />}
        </InputLabel>

        <TableContainer component={Paper} sx={{ border: `1px solid ${requiredColor()}`, width: 'inherit' }}>
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
              {questionsInterval.length > 0 && questionsInterval.map((qa:any) => (
                <TableRow key={qa.id}>
                  <TableCell>
                    {qa.EA_SA_rfTimeInterval}
                  </TableCell>
                  <TableCell style={{ padding: '0px' }}>
                    {recordInfo.crudAction === 'edit' &&
                      <Select
                        sx={{
                          width: '100%',
                          "& fieldset": {
                            borderWidth: "0px",
                          }, }}
                        style={{ fontSize: '14px' }}
                        name={fieldName}
                        id={templateId}
                        native
                        defaultValue={getValue(lookup, qa.id, qa.EA_SA_rsAssessmentResponseOptions)}
                        onChange={(event: any) => {
                          onChange('SSP', event);
                          timeIntervalUpdate(qa.id, event);
                          fnReqField();
                        }}
                      >
                        <option aria-label="None" value="">Select Impact</option>
                        {quesResponseOptions.length > 0 && quesResponseOptions.map((item: any) => {
                          return <option value={item.id}>{item.name}</option>
                        })}
                      </Select>
                    }
                    {recordInfo.crudAction === 'view' &&
                      <div style={{padding: '12px 16px'}}>{getNameValue(quesResponseOptions, qa.EA_SA_rsAssessmentResponseOptions)}</div>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {isQuestionRequired() &&
          <InputLabel sx={{ fontSize: '12px' }} error={!timeIntervalUpdated}>
            {"This question is required!"}
          </InputLabel>
        }
      </FormGroup>
    </div>
  );
};