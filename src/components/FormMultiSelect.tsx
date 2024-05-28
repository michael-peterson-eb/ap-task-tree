import { useEffect, useState, Fragment } from 'react';
import {
  TextField,
  Autocomplete,
  FormControl,
  ThemeProvider,
  FormGroup,
} from "@mui/material";

import { FormInputProps } from "./FormInputProps";

import {
  getAssessmentQuestion
} from "../model/Questions";

import {
  fetchResponseOptionsByTemplateId
} from "../model/ResponseOptions";

import {
  getArrayValue,
  getMultiValue } from '../common/Utils';

import { CustomFontTheme } from '../common/CustomTheme';
import { fieldLabel } from './Helpers';

export const FormMultiSelect = (props: FormInputProps) => {
  const {
    fieldName,
    recordInfo,
    qtype,
    data,
    onChange,
    lookup,
    fnSecQA,
    fnReqField,
    preloadedAQ} = props;

  const [assessQuestions, setAssessQuestion] = useState([]);
  const [quesResponseOptions, setQuesResponseOptions] = useState([]);
  const [defaultValues, setDefaultValues] = useState([]);

  const templateId = data.id;

  const fetchQuestionsAndOptions = async () => {

    const assessQuestions:any = await getAssessmentQuestion(recordInfo, templateId, preloadedAQ);
    setAssessQuestion(assessQuestions);
    //onsole.log("--fetchQuestionsIntervalsByTemplateId:question--", assessQuestions)

    const responseOptions = await fetchResponseOptionsByTemplateId(templateId);
    //console.log("--fetchQuestionsIntervalsByTemplateId:options--", templateId, responseOptions)

    setQuesResponseOptions(responseOptions);

    if (assessQuestions && assessQuestions.length > 0) {
      const stringValues = fieldName != null ? assessQuestions[0][fieldName] : "";
      //const stringValues = assessQuestions[0].EA_SA_txtaResponse;
      const defaultValue = getDefaultValue(responseOptions, stringValues);
      //console.log("--fetchQuestionsIntervalsByTemplateId:default--", stringValues, responseOptions, defaultValue)
      setDefaultValues(getArrayValue(lookup, assessQuestions[0].id, defaultValue));
    }
  }

  useEffect(() => {
    fetchQuestionsAndOptions().catch(console.error);
  }, [templateId])

  const getDefaultValue = (options: any, stored: string) => {
    if (recordInfo.crudAction == 'view' && stored == null) {
      return [{ id: '0', name: 'No Answer' }];
    }

    if (stored == null) return [];
    const matched = options.filter((opt: any) => {
      if (stored.indexOf(opt.id) >= 0) return opt;
    });

    return matched;
  };

  return (
    <Fragment>
      {assessQuestions.map((aq:any) => (
        <FormControl sx={{ width: '100%' }}>
          {recordInfo.crudAction == "edit" &&
            <ThemeProvider theme={CustomFontTheme}>
              <FormGroup sx={{ paddingTop: 2 }}>
                <Autocomplete
                  sx={{ fontSize: '14px' }}
                  multiple
                  id={aq.id}
                  options={quesResponseOptions}
                  value={defaultValues}
                  getOptionLabel={(option: any) => option.name}
                  disableCloseOnSelect
                  renderOption={(props, option:any) => {
                    return (
                      <li {...props} key={option.id}>
                        {option.name}
                      </li>
                    );
                  }}
                  onChange={(event: any, newValue: any | null) => {
                    setDefaultValues([...newValue])
                    onChange('MSP', event, { id: aq.id, name: fieldName, value: newValue });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name={fieldName}
                      id={aq.id}
                      label={aq.name}
                    />
                  )}
                />
              </FormGroup>
            </ThemeProvider>
          }
          {recordInfo.crudAction == "view" &&
            <TextField
              label={fieldLabel(data.EA_SA_txtaQuestion)}
              value={getMultiValue(quesResponseOptions, aq.EA_SA_txtaResponse)}
              InputProps={{ readOnly: true }}
            />
          }
        </FormControl>
      ))}
    </Fragment>
  );
}