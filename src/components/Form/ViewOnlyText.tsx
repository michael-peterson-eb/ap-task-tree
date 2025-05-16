import { FormControl, TextField, InputAdornment, Typography, Chip, Stack } from "@mui/material";
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

  if (responseFormat === "MSP") {
    // @ts-ignore This will be a string in case of MSP
    const values = value.split(",");

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
        <Stack direction="row" spacing={1} sx={mspBoxStyles}>
          {values.map((value) => {
            const selectedOption = responseOptions?.find((option) => option.name.trim() === value.trim());
            const chipColor = selectedOption?.EA_SA_txtLabelColor || "#000000";
            return value === "No Answer" ? (
              <Typography sx={{ fontWeight: 400, fontSize: 14, color: "rgba(0, 0, 0, 0.60)" }}>{value}</Typography>
            ) : (
              <Chip label={value} sx={{ borderRadius: "4px" }} size="small" icon={<Chip label="" size="small" sx={{ ...chipStyles, backgroundColor: chipColor }} />} />
            );
          })}
        </Stack>
      </FormControl>
    );
  }

  // Chip colors for SSP
  const selectedOption = responseOptions?.find((option) => option.name === value);
  const chipColor = selectedOption?.EA_SA_txtLabelColor || "#000000"; // Default to black if no color is found

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

      <TextField
        disabled
        size="small"
        value={value}
        sx={{ fontWeight: 400, fontSize: 14, color: "#1B2327" }}
        InputProps={{ startAdornment: responseFormat === "SSP" && <Chip label="" sx={{ ...chipStyles, backgroundColor: chipColor }} /> }}
      />
    </FormControl>
  );
};

const mspBoxStyles = {
  paddingRight: "12px",
  paddingLeft: "12px",
  paddingTop: "8px",
  paddingBottom: "8px",
  borderRadius: "4px",
  border: "1px solid rgba(0, 0, 0, 0.60)",
};

const chipStyles = {
  width: "14px",
  height: "14px",
  borderRadius: "2px !important",
  marginRight: "2px !important",
  border: "1px solid rgba(0, 0, 0, 0.60)",
};
