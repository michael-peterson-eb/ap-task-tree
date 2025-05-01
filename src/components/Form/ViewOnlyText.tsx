import { FormControl, TextField, InputAdornment, Typography } from "@mui/material";
import { setInnerHTML } from "../../utils/cleanup";
import { Dayjs } from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const ViewOnlyText = ({
  label,
  responseFormat = null,
  value,
  required,
}: {
  label: string | null;
  responseFormat?: string | null;
  size?: any;
  value: string | Dayjs | null;
  required?: boolean;
}) => {
  const inputProps = {
    readOnly: true,
  };

  if (responseFormat === "CCY") {
    //@ts-ignore
    inputProps.startAdornment = <InputAdornment position="start">US$</InputAdornment>;
  }

  if (responseFormat === "DATE") {
    return (
      <FormControl fullWidth variant="standard">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker disabled label={setInnerHTML(label)} value={value} />
        </LocalizationProvider>
      </FormControl>
    );
  }

  return (
    <FormControl fullWidth>
      {label ? (
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: 14,
            color: "#1B2327",
            paddingBottom: "4px",
          }}
        >
          {setInnerHTML(label)}
          {required && <span style={{ color: "red" }}>&nbsp;*</span>}
        </Typography>
      ) : null}
      <TextField disabled size="small" value={value} sx={{ fontWeight: 400, fontSize: 14, color: "#1B2327" }} />
    </FormControl>
  );
};
