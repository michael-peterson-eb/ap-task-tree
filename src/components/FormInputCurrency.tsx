import { FormInputProps } from "./FormInputProps";

import {
  FormControl,
  Input,
  InputLabel,
  InputAdornment
} from '@mui/material';

export const FormInputCurrency = ({ data }: FormInputProps) => {
  return(
    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
      <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
      <Input
        id="standard-adornment-amount"
        startAdornment={<InputAdornment position="start">$</InputAdornment>}
      />
    </FormControl>
  )
};