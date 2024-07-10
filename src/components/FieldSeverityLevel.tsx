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
  cleanLabel
} from '../common/Utils';

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

export const TextAreaField = (props: any) => {
  const {period, recordInfo, aq, data, onChange, fnReqField, nValue, pValue} = props;

  const [normalFieldValue, setNormalFieldValue] = useState(nValue);
  const [peakFieldValue, setPeakFieldValue] = useState(pValue);

  const templateId = data.id;

  const setStateValue = (value:any) => {
    if ( period == "EA_OR_Normal" ) setNormalFieldValue(value);

    if ( period == "EA_OR_Peak" ) setPeakFieldValue(value);
  }

  const getFieldValue = () => {
    if ( period == "EA_OR_Normal" ) return normalFieldValue;

    if ( period == "EA_OR_Peak" ) return peakFieldValue;
  }

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
                value={getFieldValue()}
                InputProps={{
                  style: { fontSize: '14px' },
                  ...recordInfo.crudAction == 'view' ? { readOnly: true } : { readOnly: false }
                }}
                InputLabelProps={{ style: { fontSize: '18px', backgroundColor: '#FFF' } }}
                onChange={(event: any) => {
                  const { name, value } = event.target;
                  setStateValue(value);
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