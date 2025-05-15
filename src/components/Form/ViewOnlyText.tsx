import { FormControl, TextField, InputAdornment, Typography, Chip } from "@mui/material";
import { setInnerHTML } from "../../utils/cleanup";
import { Dayjs } from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const ViewOnlyText = ({
  label,
  responseFormat = null,
  value,
  required,
  responseOptions,
}: {
  label: string | null;
  responseFormat?: string | null;
  size?: any;
  value: string | Dayjs | null;
  required?: boolean;
  responseOptions?: any[];
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

  // Find the relevant response option
  const selectedOption = responseOptions?.find((option) => option.name === value);

  const chipColor = selectedOption?.EA_SA_txtLabelColor || "#000000"; // Default to black if no color is found
  console.log("chipColor", chipColor, "selectedOption", selectedOption, "responseFormat", responseFormat, "responseOptions",responseOptions);

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

      <TextField disabled size="small" value={value} sx={{ fontWeight: 400, fontSize: 14, color: "#1B2327" }} InputProps={{ startAdornment:(
        responseFormat === "SSP" && <Chip label="" sx={{ ...chipStyles, backgroundColor: chipColor }} />
      )}}/>
    </FormControl>
  );
};

const chipStyles = {
  backgroundColor: "#000000", 
  width: "14px",
  height: "14px",
  borderRadius: "2px",
  marginRight: "4px",
};
