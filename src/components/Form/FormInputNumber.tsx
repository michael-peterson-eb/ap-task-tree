//@ts-nocheck

import { FormInputProps } from "../../types/FormInputProps";
import { TextField, FormControl } from '@mui/material';

export const FormInputNumber = ({ data, onChange }: FormInputProps) => {
  return (
    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
      <TextField
        label={data.EA_SA_txtaQuestion}
        id={data.id}
        name={'EA_SA_intResponse'}
        sx={{ m: 1, fontSize: '1.5rem' }}
        InputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}
        onChange={onChange}
      />
    </FormControl>
  );
};