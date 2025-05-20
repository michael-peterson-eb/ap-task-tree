import { Select, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormGroup, MenuItem, Typography, Box } from "@mui/material";
import { FormInputProps } from "../../types/FormInputProps";
import { fetchQuestionsIntervalsByTemplateId } from "../../model/Questions";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "../Loading";
import { ViewOnlyText } from "./ViewOnlyText";
import { showTimeInterval } from "../../utils/format";
import { getNameValue, isQuestionRequired } from "../../utils/common";
import { setInnerHTML } from "../../utils/cleanup";
import { Controller } from "react-hook-form";

export const FormTimeInterval = ({ fieldName, appParams, assessmentQuestion, control, handleChange, questionTemplateData, responseOptions }: FormInputProps) => {
  const { EA_SA_rfRequiredQuestion } = assessmentQuestion;
  const required = isQuestionRequired(EA_SA_rfRequiredQuestion);
  const { crudAction: mode } = appParams;

  // Get Time Intervals
  const { isPending: timeIntervalsPending, data: timeIntervals } = useQuery({
    queryKey: [`fetchQuestionsIntervalsByTemplateId-${questionTemplateData.id}`],
    queryFn: () => fetchQuestionsIntervalsByTemplateId(appParams, questionTemplateData.id),
  });

  if (timeIntervalsPending) return <Loading type="none" />;

  if (mode === "view") {
    return (
      <>
        <Box sx={{ marginTop: 2, display: "block" }}>
          <InputLabel
            sx={{
              display: "flex",
              whiteSpace: "normal",
              "& .MuiInputLabel-asterisk": { color: "red" },
            }}
            required={required}
          >
            {timeIntervals.length > 0 ? (
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: 14,
                  color: "#1B2327",
                  paddingBottom: "4px",
                }}
              >
                {setInnerHTML(timeIntervals[0].EA_SA_rfQuestion)}
              </Typography>
            ) : null}
          </InputLabel>

          <TableContainer component={Paper} sx={{ border: "1px solid rgba(0, 0, 0, 0.65)", width: "inherit" }}>
            <Table sx={{ width: "100%" }} size="small">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#9cc1ff33",
                    "& th": { fontSize: "1.25rem" },
                  }}
                >
                  <TableCell style={{ width: "25%" }}>Time Interval</TableCell>
                  <TableCell style={{ width: "75%" }}>Impact</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeIntervals.length > 0 &&
                  timeIntervals.map((timeInterval: any) => {
                    const backendValue = timeInterval[fieldName!];
                    return (
                      <TableRow key={timeInterval.id}>
                        <TableCell>{showTimeInterval(timeInterval)}</TableCell>
                        <TableCell>
                          <ViewOnlyText label={null} value={getNameValue(responseOptions, backendValue)} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </>
    );
  }

  if (mode === "edit") {
    return (
      <>
        <FormGroup sx={{ paddingTop: 2, display: "block" }}>
          <InputLabel
            sx={{
              display: "flex",
              whiteSpace: "normal",
              "& .MuiInputLabel-asterisk": { color: "red" },
            }}
            required={required}
          >
            {timeIntervals.length > 0 ? (
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: 14,
                  color: "#1B2327",
                  paddingBottom: "4px",
                }}
              >
                {setInnerHTML(timeIntervals[0].EA_SA_rfQuestion)}
              </Typography>
            ) : null}
          </InputLabel>

          <TableContainer component={Paper} sx={{ border: "1px solid rgba(0, 0, 0, 0.75)", width: "inherit" }}>
            <Table sx={{ width: "100%" }} size="small">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#9cc1ff33",
                    "& th": { fontSize: "1.25rem" },
                  }}
                >
                  <TableCell style={{ width: "20%" }}>Time Interval</TableCell>
                  <TableCell style={{ width: "80%" }}>Impact</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeIntervals.length > 0 &&
                  timeIntervals.map((timeInterval: any) => {
                    const timeIntervalRequired = isQuestionRequired(timeInterval.EA_SA_rfRequiredQuestion);
                    let backendValue = timeInterval[fieldName!];

                    if (!backendValue) {
                      backendValue = "";
                    }

                    return (
                      <TableRow key={timeInterval.id}>
                        <TableCell>{showTimeInterval(timeInterval)}</TableCell>
                        <TableCell>
                          <Controller
                            control={control}
                            defaultValue={backendValue}
                            name={`${timeInterval.id}.${fieldName}`}
                            rules={{ required: timeIntervalRequired }}
                            render={({ field: { onChange, value }, fieldState: { error } }) => {
                              return (
                                <Select
                                  displayEmpty
                                  size="small"
                                  error={!!error}
                                  id={timeInterval.id}
                                  labelId={`time-interval-${timeInterval.id}`}
                                  onChange={(event) => {
                                    onChange(event);

                                    const eventObj = {
                                      target: {
                                        id: timeInterval.id,
                                        name: fieldName,
                                        value: event.target.value,
                                      },
                                    };

                                    handleChange(eventObj, null);
                                  }}
                                  required={timeIntervalRequired}
                                  sx={styles}
                                  value={value}
                                >
                                  <MenuItem aria-label="" value="">
                                    <em>Select impact</em>
                                  </MenuItem>
                                  {responseOptions.length > 0 &&
                                    responseOptions.map((responseOption: any) => {
                                      return (
                                        <MenuItem value={responseOption.id}>
                                          <Typography>{responseOption.name}</Typography>
                                        </MenuItem>
                                      );
                                    })}
                                </Select>
                              );
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </FormGroup>
      </>
    );
  }

  return null;
};

const styles = 
  {
    width: "100%",
    "& fieldset": { borderWidth: "0px" },
    '& .rbs-validationMsg': {
      display: 'none !important'
    }
  }
