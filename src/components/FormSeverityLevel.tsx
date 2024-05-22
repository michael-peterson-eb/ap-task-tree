import {
  useEffect,
  useState,
  useRef } from 'react';

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
  FormGroup
} from '@mui/material';

import { FormInputProps } from "./FormInputProps";

import {
  fetchQuestionsSeverityByTemplateId
} from "../model/Questions";

import {
  fetchResponseOptionsByTemplateId
} from "../model/ResponseOptions";

import { getNameValue, getValue, stripTextHtmlTags } from '../common/Utils';

import DOMPurify from "dompurify";

import { TextAreaField } from './FieldSeverityLevel';
import { FormInputCurrency } from './FormInputCurrency';
import { FormInputText } from './FormInputText';
import { FormMultiSelect } from './FormMultiSelect';
import { FormSingleSelect } from './FormSingleSelect';
import { FormTimeInterval } from './FormTimeInterval';
import { FormInputDate } from './FormInputDate';
import { FormInputInteger } from './FormInputInteger';
import { FormInputDecimal } from './FormInputDecimal';
import { FormYesNo } from './FormInputYesNo';

export const FormSeverityLevel = (props: FormInputProps) => {
  const {
    fieldName,
    recordInfo,
    qtype,
    data,
    onChange,
    onChangeCustom,
    lookup,
    fnSecQA,
    fnReqField} = props;

  const severityLabelWidth = "40";
  const bothInScopeWidth = "30";
  const oneInScopeWidth = "60";

  const [questionsSeverity, setQuestionsSeverity] = useState([]);
  const [quesResponseOptions, setQuesResponseOptions] = useState([]);
  const [severityLevelUpdated, setSeverityLevelUpdated] = useState(false);
  const [periodInScope, setPeriodInScope] = useState("");
  const colWidth = useRef(oneInScopeWidth);

  const templateId = data.id;

  const checkSeverityLevelHasValue = ()=> {
    const found = questionsSeverity.filter( (qi:any) => {
      return qi.EA_SA_rsAssessmentResponseOptions && parseInt(qi.EA_SA_rsAssessmentResponseOptions) > 0
    });

    const cached = questionsSeverity.filter( (qi:any) => {
      const val = getValue(lookup, qi.id, qi.EA_SA_rsAssessmentResponseOptions);
      return parseInt(val) > 0;
    });

    if ( found.length > 0 || cached.length > 0 ) {
      setSeverityLevelUpdated(true);

    } else {
      setSeverityLevelUpdated(false);
    }
  }

  const severityLevelUpdate = (id: any, event: any) => {
    const { name, value } = event.target;

    let found:any = questionsSeverity.find((quesInt:any) => {
      return quesInt.id == id;
    });

    const updatedMap = {
      ...found,
      ...{EA_SA_rsAssessmentResponseOptions: value == "" ? null : value}
    };

    const newQuesInterval:any = questionsSeverity.map((qin:any) => {
      return qin.id == id ? updatedMap : qin;
    });

    setQuestionsSeverity(newQuesInterval);
  }

  const isQuestionRequired = () => {
    return data.EA_SA_cbRequiredQuestion == 1 && !severityLevelUpdated;
  }

  const requiredColor = () => {
    return isQuestionRequired() ? "#d32f2f" : "#000"
  }

  // check if at least one of the Severity Level has value selected
  const atLeastOneSeverityHasValue = (tiQs:any) => {
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

  const storePeriodInScope = (sevLevels:any) => {
    if ( sevLevels.length > 0 ) {
      const inScope = sevLevels[0].EA_OR_mddlPeriodsInScope;

      setPeriodInScope(inScope);

      if (periodInScopeHas(inScope, "EA_OR_Normal") && periodInScopeHas(inScope, "EA_OR_Peak") ) {
        colWidth.current = bothInScopeWidth;
      } else {
        colWidth.current = oneInScopeWidth;
      }
    }
  }

  const periodInScopeHas = (inScope:any, periodScope:string) => {
    return inScope.indexOf(periodScope) >= 0;
  }

  useEffect(() => {
    const fetchQuestionsAndOptions = async () => {
      const severityLevels = await fetchQuestionsSeverityByTemplateId(recordInfo, data.id);
      console.log("--fetchQuestionsSeverityByTemplateId--", severityLevels)

      const responseOptions = await fetchResponseOptionsByTemplateId(templateId);
      console.log("--fetchQuestionsSeverityByTemplateId:options--", responseOptions)

      setQuestionsSeverity(severityLevels);
      setQuesResponseOptions(responseOptions);

      storePeriodInScope(severityLevels);
      checkSeverityLevelHasValue();

      const tiSelected = atLeastOneSeverityHasValue(severityLevels);
      fnSecQA(templateId, templateId, tiSelected);
    }

    fetchQuestionsAndOptions().catch(console.error);
  }, [templateId]);

  useEffect(() => {
    checkSeverityLevelHasValue();
  }, [severityLevelUpdated, questionsSeverity])

  if ( questionsSeverity.length == 0 ) return "";

  return (
    <>
      {questionsSeverity.length > 0 &&
      <FormGroup sx={{ paddingTop: 2 }}>
        <InputLabel
          sx={{ color:
            `${requiredColor()}`,
            whiteSpace: 'normal'
          }}
          required={data.EA_SA_cbRequiredQuestion == 1}
        >
          {questionsSeverity.length > 0 && <div dangerouslySetInnerHTML={{
          __html: cleanLabel(questionsSeverity[0].EA_SA_rfQuestion)
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
                <TableCell style={{ width: severityLabelWidth }}>Severity Level</TableCell>
                {periodInScopeHas(periodInScope, "EA_OR_Normal") &&
                  <TableCell style={{ width: colWidth.current }}>Impact at Normal Period</TableCell>
                }
                {periodInScopeHas(periodInScope, "EA_OR_Peak") &&
                  <TableCell style={{ width: colWidth.current }}>Impact at Peak Period</TableCell>
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {questionsSeverity.length > 0 && questionsSeverity.map((qa:any) => (
                <TableRow key={qa.id}>
                  <TableCell>
                    {qa.EA_OR_txtSeverityLevelName}
                  </TableCell>
                  {periodInScopeHas(periodInScope, "EA_OR_Normal") &&
                    <TableCell style={{ padding: '0px' }}>
                      {data.EA_SA_ddlResponseFormat === 'FRES' &&
                        <FormInputText
                          fieldName={"EA_SA_txtaResponse"}
                          recordInfo={recordInfo}
                          qtype={qtype}
                          data={data}
                          onChange={onChange}
                          lookup={lookup}
                          fnSecQA={fnSecQA}
                          fnReqField={fnReqField}/>
                      }
                    </TableCell>
                  }
                  {periodInScopeHas(periodInScope, "EA_OR_Peak") &&
                    <TableCell style={{ padding: '0px' }}>
                      {data.EA_SA_ddlResponseFormat === 'FRES' &&
                        <FormInputText
                          fieldName={"EA_OR_txtaResponse"}
                          recordInfo={recordInfo}
                          qtype={qtype}
                          data={data}
                          onChange={onChange}
                          lookup={lookup}
                          fnSecQA={fnSecQA}
                          fnReqField={fnReqField}/>
                      }
                    </TableCell>
                  }
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {isQuestionRequired() &&
          <InputLabel sx={{ fontSize: '12px' }} error={!severityLevelUpdated}>
            {"This question is required!"}
          </InputLabel>
        }
      </FormGroup>
      }
    </>
  );
};