import { FormInputProps } from "./FormInputProps";
import { TextField, FormControl } from '@mui/material';

export const FormInputText = ({ data, onChange}: FormInputProps) => {
  return (
    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
      <TextField
        sx={{ m: 1 }}
        required={ data.EA_SA_cbRequiredQuestion == 0}
        helperText={data.EA_SA_txtaHelpText}
        id={data.id}
        label={data.EA_SA_txtaQuestion}
        name={data.id}
        onChange={onChange}
        />
    </FormControl>
  );
};