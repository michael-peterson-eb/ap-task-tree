import { useEffect, useState } from 'react';
import {
  TextField,
  Autocomplete,
  FormControl,
} from "@mui/material";
import { FormInputProps } from "./FormInputProps";
import {
  fetchAssessQuestionsByTemplateId
} from "../model/Questions";
import {
  fetchResponseOptionsByTemplateId
} from "../model/ResponseOptions";

import { getArrayValue } from '../common/Utils';

export const FormMultiSelect = ({ recordInfo, qtype, data, onChange, lookup }: FormInputProps) => {
  const [assessQuestions, setAssessQuestion] = useState([]);
  const [quesResponseOptions, setQuesResponseOptions] = useState([]);
  const [defaultValues, setDefaultValues] = useState([]);

  const templateId = data.id;

  const fetchQuestionsAndOptions = async () => {
    const assessQuestions = await fetchAssessQuestionsByTemplateId(recordInfo, templateId);
    setAssessQuestion(assessQuestions);
    //console.log("--fetchQuestionsIntervalsByTemplateId:question--", assessQuestions)

    const responseOptions = await fetchResponseOptionsByTemplateId(templateId);
    //console.log("--fetchQuestionsIntervalsByTemplateId:options--", responseOptions)

    setQuesResponseOptions(responseOptions);

    if (assessQuestions && assessQuestions.length > 0) {
      const stringValues = assessQuestions[0].EA_SA_txtaResponse;
      const defaultValue = getDefaultValue(responseOptions, stringValues);
      console.log("--fetchQuestionsIntervalsByTemplateId:default--", stringValues, responseOptions, defaultValue)
      setDefaultValues(getArrayValue(lookup, assessQuestions[0].id, defaultValue));
    }
  }

  useEffect(() => {
    fetchQuestionsAndOptions().catch(console.error);
  }, [])

  const getDefaultValue = (options: any, stored: string) => {
    if (recordInfo.crudAction == 'view' && stored == null) {
      return [{ id: '0', name: 'No Answer' }];
    }

    if (stored == null) return [];
    const matched = options.filter((opt: any) => {
      if (stored.indexOf(opt.id) >= 0) {
        return opt;
      }
    });
    return matched;
  };

  return (
    <div>
      {assessQuestions.map((aq) => (
        <FormControl fullWidth sx={{ marginTop: 4 }}>
          <Autocomplete
            sx={{ fontSize: '14px' }}
            multiple
            id={aq.id}
            options={quesResponseOptions}
            value={defaultValues}
            getOptionLabel={(option) => option.name}
            disableCloseOnSelect
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              );
            }}
            onChange={(event: any, newValue: any | null) => {
              setDefaultValues([...newValue])
              onChange('MSP', event, { name: aq.id, value: newValue });
            }}
            readOnly={recordInfo.crudAction == 'view' ? true : false}
            renderInput={(params) => (
              <TextField
                sx={{ marginTop: '12px' }}
                {...params}
                name={aq.id}
                label={aq.name}
              />
            )}
          />
        </FormControl>
      ))}
    </div>
  );
}