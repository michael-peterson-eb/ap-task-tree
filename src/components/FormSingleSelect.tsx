import { FormInputProps } from "./FormInputProps";
import {
    FormControl,
    Select,
    MenuItem,
    FormHelperText,
    InputLabel,
} from '@mui/material';

export const FormSingleSelect = ({ data, onChange}: FormInputProps) => {
  return (
    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
      <InputLabel id="demo-simple-select-required-label">{data.EA_SA_txtaQuestion}</InputLabel>        label=
      <Select
        labelId="demo-simple-select-required-label"
        id="demo-simple-select-required"
        value={data.value}
        label={data.EA_SA_txtaQuestion}
        onChange={onChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {data.items.map((item:any) => {
          return <MenuItem value={item.value}>{item.name}</MenuItem>
        })}
      </Select>
      <FormHelperText>Required</FormHelperText>
    </FormControl>
  );
};