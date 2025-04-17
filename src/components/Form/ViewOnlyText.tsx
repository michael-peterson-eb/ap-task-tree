import { FormControl, TextField, InputAdornment } from "@mui/material";
import { setInnerHTML } from "../../utils/cleanup";
import { Dayjs } from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const ViewOnlyText = ({
  label,
  value,
  responseFormat = null,
  size = "medium",
}: {
  label: string | null;
  value: string | Dayjs | null;
  responseFormat?: string | null;
  size?: any;
}) => {
  const disabledColor = "rgba(0, 0, 0, 0.65)";
  const inputProps = { readOnly: true };

  if (responseFormat === "CCY") {
    //@ts-ignore
    inputProps.startAdornment = <InputAdornment position="start">US$</InputAdornment>;
  }

  if (responseFormat === "DATE") {
    return (
      <FormControl fullWidth variant="standard">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label={setInnerHTML(label)}
            value={value}
            disabled
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: disabledColor,
              },
            }}
          />
        </LocalizationProvider>
      </FormControl>
    );
  }

  return (
    <FormControl fullWidth>
      <TextField
        label={label ? setInnerHTML(label) : null}
        value={value}
        InputProps={inputProps}
        disabled
        InputLabelProps={{
          style: { color: disabledColor },
        }}
        size={size}
        sx={{
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: disabledColor,
          },
        }}
      />
    </FormControl>
  );
};
