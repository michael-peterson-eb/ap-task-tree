import { FormInputProps } from "./FormInputProps";

import {
  FormControl,
  TextField,
  InputAdornment
} from '@mui/material';

export const FormInputCurrency = ({ data, onChange }: FormInputProps) => {
  return(
    <FormControl fullWidth sx={{ m: 1, fontSize: 18 }} variant="standard">
      <TextField
        label={data.EA_SA_txtaQuestion}
        id={data.id}
        name={data.id}
        sx={{ m: 1 }}
        InputProps={{
          startAdornment: <InputAdornment position="start">US$</InputAdornment>,
          inputMode: 'numeric', pattern: '[0-9]*'
        }}
        onChange={onChange}
      />
    </FormControl>
  )
};