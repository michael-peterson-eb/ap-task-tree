<TextField inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />

import { FormInputProps } from "./FormInputProps";
import { TextField } from '@mui/material';

export const FormInputNumber = ({ data }: FormInputProps) => {
  return (
    <TextField inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
  );
};