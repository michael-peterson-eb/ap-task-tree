import { FormInputProps } from "./FormInputProps";
import { TextField } from '@mui/material';

export const FormInputText = ({ data }: FormInputProps) => {
  return (
    <TextField
      required={ data.EA_SA_cbRequiredQuestion == 0}
      helperText="Please enter your name"
      id={data.id}
      label={data.EA_SA_txtaQuestion}
      name={data.id}
      />
  );
};